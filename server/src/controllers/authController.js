import { User } from '../models/User.js';
import { OtpVerification, OTP_PURPOSES } from '../models/OtpVerification.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateSecureOtp, hashOtp, verifyOtpHash } from '../utils/otp.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../utils/token.js';
import { sendEmailOtp } from '../services/emailService.js';
import { isSmtpConfigured } from '../config/env.js';
import {
  registerSchema,
  verifyEmailSchema,
  resendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyResetOtpSchema,
  resetPasswordSchema
} from '../utils/validation.js';

const OTP_EXPIRY_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;

/**
 * Register a new user
 */
export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    let user;
    if (existingUser) {
      // Re-use unverified user account
      existingUser.name = name;
      existingUser.passwordHash = passwordHash;
      user = await existingUser.save();
    } else {
      user = await User.create({
        name,
        email,
        passwordHash,
        isEmailVerified: false
      });
    }

    // Invalidate existing registration OTPs for this email
    await OtpVerification.updateMany(
      { email, purpose: OTP_PURPOSES.REGISTRATION, consumedAt: null },
      { consumedAt: new Date() }
    );

    // Generate secure 6-digit OTP
    const rawOtp = generateSecureOtp();
    const hashedOtp = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Persist OTP in MongoDB
    await OtpVerification.create({
      userId: user._id,
      email,
      otpHash: hashedOtp,
      purpose: OTP_PURPOSES.REGISTRATION,
      expiresAt,
      attempts: 0,
      lastSentAt: new Date()
    });

    // Send email via Gmail SMTP
    let emailDispatched = false;
    let smtpNotice = null;

    if (isSmtpConfigured()) {
      try {
        await sendEmailOtp({
          to: email,
          name: user.name,
          otp: rawOtp,
          purpose: OTP_PURPOSES.REGISTRATION
        });
        emailDispatched = true;
      } catch (mailError) {
        console.error('[Registration Email Error]', mailError.message);
        smtpNotice = `Failed to deliver email: ${mailError.message}`;
      }
    } else {
      smtpNotice = 'SMTP credentials not configured in server/.env. Please configure SMTP_USER and SMTP_PASS for Gmail delivery.';
      console.warn(`[SecureAuth] ${smtpNotice}`);
    }

    return res.status(201).json({
      success: true,
      message: emailDispatched
        ? 'Account registered. Verification code dispatched to your email.'
        : 'Account created. Email verification required.',
      email,
      isEmailVerified: false,
      smtpConfigured: isSmtpConfigured(),
      ...(smtpNotice && { warning: smtpNotice })
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Email with 6-digit OTP
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = verifyEmailSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account associated with this email.'
      });
    }

    if (user.isEmailVerified) {
      const token = generateToken({ id: user._id, email: user.email });
      setAuthCookie(res, token);
      return res.status(200).json({
        success: true,
        message: 'Email is already verified.',
        user
      });
    }

    // Find latest active OTP
    const otpRecord = await OtpVerification.findOne({
      email,
      purpose: OTP_PURPOSES.REGISTRATION,
      consumedAt: null
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No pending verification code found. Please request a new code.'
      });
    }

    // Check expiration
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      });
    }

    // Check maximum attempts
    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      otpRecord.consumedAt = new Date();
      await otpRecord.save();
      return res.status(429).json({
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new code.'
      });
    }

    // Verify OTP
    const isMatch = verifyOtpHash(otp, otpRecord.otpHash);
    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = MAX_OTP_ATTEMPTS - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        message: `Invalid verification code. ${remaining} attempts remaining.`
      });
    }

    // Mark OTP consumed
    otpRecord.consumedAt = new Date();
    await otpRecord.save();

    // Activate user in MongoDB
    user.isEmailVerified = true;
    await user.save();

    // Issue JWT in HTTP-only cookie
    const token = generateToken({ id: user._id, email: user.email });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to SecureAuth.',
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend OTP with cooldown and rate limiting
 */
export const resendOtp = async (req, res, next) => {
  try {
    const { email, purpose } = resendOtpSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found with this email.'
      });
    }

    if (purpose === OTP_PURPOSES.REGISTRATION && user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Account email is already verified. Please log in.'
      });
    }

    // Check cooldown from latest sent OTP
    const lastOtp = await OtpVerification.findOne({
      email,
      purpose
    }).sort({ createdAt: -1 });

    if (lastOtp && lastOtp.lastSentAt) {
      const elapsedSeconds = Math.floor((Date.now() - new Date(lastOtp.lastSentAt).getTime()) / 1000);
      if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
        const remainingSeconds = RESEND_COOLDOWN_SECONDS - elapsedSeconds;
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSeconds}s before requesting a new code.`,
          retryAfterSeconds: remainingSeconds
        });
      }
    }

    // Invalidate prior active OTPs
    await OtpVerification.updateMany(
      { email, purpose, consumedAt: null },
      { consumedAt: new Date() }
    );

    // Generate fresh OTP
    const rawOtp = generateSecureOtp();
    const hashedOtp = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OtpVerification.create({
      userId: user._id,
      email,
      otpHash: hashedOtp,
      purpose,
      expiresAt,
      attempts: 0,
      lastSentAt: new Date()
    });

    let emailDispatched = false;
    let warning = null;

    if (isSmtpConfigured()) {
      try {
        await sendEmailOtp({
          to: email,
          name: user.name,
          otp: rawOtp,
          purpose
        });
        emailDispatched = true;
      } catch (err) {
        warning = `Email delivery failed: ${err.message}`;
      }
    } else {
      warning = 'SMTP credentials not configured. Please configure Gmail SMTP in server/.env.';
    }

    return res.status(200).json({
      success: true,
      message: emailDispatched
        ? 'A fresh verification code has been dispatched to your email.'
        : 'A new code was generated. SMTP email delivery pending configuration.',
      email,
      cooldownSeconds: RESEND_COOLDOWN_SECONDS,
      ...(warning && { warning })
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Explicitly include passwordHash
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.'
      });
    }

    // Verify password hash
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.'
      });
    }

    // Check email verification status
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your email address is not verified yet. Please enter the verification code.',
        requiresVerification: true,
        email: user.email
      });
    }

    // Generate JWT and set HTTP-only cookie
    const token = generateToken({ id: user._id, email: user.email });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Welcome back!',
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout
 */
export const logout = (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

/**
 * Get current authenticated user
 */
export const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};

/**
 * Forgot password - request recovery OTP
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await User.findOne({ email });
    // Protect against account enumeration: always return 200 generic message
    if (user && user.isEmailVerified) {
      // Invalidate existing reset OTPs
      await OtpVerification.updateMany(
        { email, purpose: OTP_PURPOSES.PASSWORD_RESET, consumedAt: null },
        { consumedAt: new Date() }
      );

      const rawOtp = generateSecureOtp();
      const hashedOtp = hashOtp(rawOtp);
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

      await OtpVerification.create({
        userId: user._id,
        email,
        otpHash: hashedOtp,
        purpose: OTP_PURPOSES.PASSWORD_RESET,
        expiresAt,
        attempts: 0,
        lastSentAt: new Date()
      });

      if (isSmtpConfigured()) {
        try {
          await sendEmailOtp({
            to: email,
            name: user.name,
            otp: rawOtp,
            purpose: OTP_PURPOSES.PASSWORD_RESET
          });
        } catch (err) {
          console.error('[Forgot Password Email Error]', err.message);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'If an active account exists with this email, a 6-digit recovery code has been dispatched.',
      email,
      smtpConfigured: isSmtpConfigured()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Password Reset OTP
 */
export const verifyResetOtp = async (req, res, next) => {
  try {
    const { email, otp } = verifyResetOtpSchema.parse(req.body);

    const otpRecord = await OtpVerification.findOne({
      email,
      purpose: OTP_PURPOSES.PASSWORD_RESET,
      consumedAt: null
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No pending password recovery code found. Please request a new one.'
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Recovery code has expired. Please request a new one.'
      });
    }

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      otpRecord.consumedAt = new Date();
      await otpRecord.save();
      return res.status(429).json({
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new recovery code.'
      });
    }

    const isMatch = verifyOtpHash(otp, otpRecord.otpHash);
    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = MAX_OTP_ATTEMPTS - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        message: `Invalid security code. ${remaining} attempts remaining.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Recovery code verified successfully. You may now choose a new password.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset Password with verified OTP
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = resetPasswordSchema.parse(req.body);

    const otpRecord = await OtpVerification.findOne({
      email,
      purpose: OTP_PURPOSES.PASSWORD_RESET,
      consumedAt: null
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No active recovery request found. Please restart the recovery flow.'
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Recovery code has expired. Please request a new one.'
      });
    }

    const isMatch = verifyOtpHash(otp, otpRecord.otpHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid security code. Please restart the recovery flow.'
      });
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.'
      });
    }

    // Check if new password is same as old password
    const isSameAsOld = await comparePassword(newPassword, user.passwordHash);
    if (isSameAsOld) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from your existing password.'
      });
    }

    // Update password hash
    user.passwordHash = await hashPassword(newPassword);
    user.passwordChangedAt = new Date();
    await user.save();

    // Consume OTP
    otpRecord.consumedAt = new Date();
    await otpRecord.save();

    // Invalidate session cookie if any
    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new credentials.'
    });
  } catch (error) {
    next(error);
  }
};

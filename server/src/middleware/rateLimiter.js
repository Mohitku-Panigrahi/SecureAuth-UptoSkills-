import rateLimit from 'express-rate-limit';

const isTest = process.env.NODE_ENV === 'test';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTest ? 10000 : 20, // High limit during automated tests
  skip: () => isTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

export const otpResendLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: isTest ? 10000 : 2,
  skip: () => isTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests. Please wait 60 seconds before requesting another code.'
  }
});

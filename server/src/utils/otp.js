import crypto from 'crypto';

/**
 * Generates a cryptographically secure 6-digit numeric OTP
 */
export const generateSecureOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Hashes OTP using SHA-256 with an application secret salt
 */
export const hashOtp = (otp) => {
  return crypto
    .createHmac('sha256', process.env.OTP_SECRET || 'secureauth_otp_hmac_secret_2026')
    .update(otp)
    .digest('hex');
};

/**
 * Verifies plain OTP against stored hash using constant-time comparison
 */
export const verifyOtpHash = (otp, storedHash) => {
  const computedHash = hashOtp(otp);
  const bufferA = Buffer.from(computedHash, 'hex');
  const bufferB = Buffer.from(storedHash, 'hex');
  if (bufferA.length !== bufferB.length) return false;
  return crypto.timingSafeEqual(bufferA, bufferB);
};

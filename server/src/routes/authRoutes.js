import express from 'express';
import {
  register,
  verifyEmail,
  resendOtp,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyResetOtp,
  resetPassword
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authLimiter, otpResendLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public auth endpoints
router.post('/register', authLimiter, register);
router.post('/verify-email', authLimiter, verifyEmail);
router.post('/resend-otp', otpResendLimiter, resendOtp);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/verify-reset-otp', authLimiter, verifyResetOtp);
router.post('/reset-password', authLimiter, resetPassword);

// Authenticated session check
router.get('/me', requireAuth, getMe);

export default router;

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { OtpVerification, OTP_PURPOSES } from '../src/models/OtpVerification.js';
import { hashOtp } from '../src/utils/otp.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await OtpVerification.deleteMany({});
});

describe('SecureAuth API Suite', () => {
  describe('GET /api/health', () => {
    it('returns healthy status and database connection state', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.database).toBe('Connected');
      expect(res.body.api).toBe('Running');
    });
  });

  describe('Registration & Input Validation', () => {
    it('successfully registers a user with valid details', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Alex Morgan',
        email: 'alex.morgan@uptoskills.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.email).toBe('alex.morgan@uptoskills.com');
      expect(res.body.isEmailVerified).toBe(false);

      const user = await User.findOne({ email: 'alex.morgan@uptoskills.com' });
      expect(user).toBeDefined();
      expect(user.isEmailVerified).toBe(false);

      const otp = await OtpVerification.findOne({ email: 'alex.morgan@uptoskills.com' });
      expect(otp).toBeDefined();
      expect(otp.purpose).toBe(OTP_PURPOSES.REGISTRATION);
      expect(otp.otpHash).toBeDefined();
    });

    it('rejects duplicate registration when already verified', async () => {
      await User.create({
        name: 'Verified User',
        email: 'verified@uptoskills.com',
        passwordHash: 'hashed123',
        isEmailVerified: true
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Verified User',
        email: 'verified@uptoskills.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('rejects registration with invalid email format', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Bad Email',
        email: 'invalid-email-address',
        password: 'Password123',
        confirmPassword: 'Password123'
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects registration with weak password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Weak Pass',
        email: 'weak@uptoskills.com',
        password: 'weak',
        confirmPassword: 'weak'
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects registration when confirm password does not match', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Mismatch Pass',
        email: 'mismatch@uptoskills.com',
        password: 'Password123',
        confirmPassword: 'Password456'
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Passwords do not match');
    });
  });

  describe('Email OTP Verification', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'OTP User',
        email: 'otp@uptoskills.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      });
    });

    it('successfully verifies email with correct OTP and issues auth cookie', async () => {
      // Seed a known OTP
      const testOtp = '654321';
      await OtpVerification.deleteMany({ email: 'otp@uptoskills.com' });
      await OtpVerification.create({
        email: 'otp@uptoskills.com',
        otpHash: hashOtp(testOtp),
        purpose: OTP_PURPOSES.REGISTRATION,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0
      });

      const res = await request(app).post('/api/auth/verify-email').send({
        email: 'otp@uptoskills.com',
        otp: testOtp
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.isEmailVerified).toBe(true);
      expect(res.headers['set-cookie']).toBeDefined();

      const user = await User.findOne({ email: 'otp@uptoskills.com' });
      expect(user.isEmailVerified).toBe(true);

      const otpRecord = await OtpVerification.findOne({ email: 'otp@uptoskills.com' });
      expect(otpRecord.consumedAt).toBeDefined();
    });

    it('rejects incorrect OTP and decrements remaining attempts', async () => {
      const res = await request(app).post('/api/auth/verify-email').send({
        email: 'otp@uptoskills.com',
        otp: '000000'
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid verification code');

      const otp = await OtpVerification.findOne({ email: 'otp@uptoskills.com' });
      expect(otp.attempts).toBe(1);
    });

    it('rejects expired OTP', async () => {
      await OtpVerification.updateOne(
        { email: 'otp@uptoskills.com' },
        { expiresAt: new Date(Date.now() - 10000) }
      );

      const res = await request(app).post('/api/auth/verify-email').send({
        email: 'otp@uptoskills.com',
        otp: '123456'
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('expired');
    });

    it('enforces maximum 5 attempts', async () => {
      await OtpVerification.updateOne(
        { email: 'otp@uptoskills.com' },
        { attempts: 5 }
      );

      const res = await request(app).post('/api/auth/verify-email').send({
        email: 'otp@uptoskills.com',
        otp: '123456'
      });

      expect(res.status).toBe(429);
      expect(res.body.message).toContain('Maximum verification attempts exceeded');
    });

    it('enforces resend cooldown of 60 seconds', async () => {
      const res = await request(app).post('/api/auth/resend-otp').send({
        email: 'otp@uptoskills.com',
        purpose: 'REGISTRATION'
      });

      expect(res.status).toBe(429);
      expect(res.body.message).toContain('Please wait');
    });
  });

  describe('Login & Protected Sessions', () => {
    beforeEach(async () => {
      // Register and verify user
      await request(app).post('/api/auth/register').send({
        name: 'Login Tester',
        email: 'login@uptoskills.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      });

      const otp = '987654';
      await OtpVerification.deleteMany({ email: 'login@uptoskills.com' });
      await OtpVerification.create({
        email: 'login@uptoskills.com',
        otpHash: hashOtp(otp),
        purpose: OTP_PURPOSES.REGISTRATION,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      await request(app).post('/api/auth/verify-email').send({
        email: 'login@uptoskills.com',
        otp
      });
    });

    it('logs in successfully with valid credentials and sets HTTP-only cookie', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@uptoskills.com',
        password: 'Password123'
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('login@uptoskills.com');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('rejects login with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@uptoskills.com',
        password: 'WrongPassword999'
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('rejects login for unverified account', async () => {
      await User.updateOne({ email: 'login@uptoskills.com' }, { isEmailVerified: false });

      const res = await request(app).post('/api/auth/login').send({
        email: 'login@uptoskills.com',
        password: 'Password123'
      });

      expect(res.status).toBe(403);
      expect(res.body.requiresVerification).toBe(true);
    });

    it('accesses protected /api/auth/me when authenticated via cookie', async () => {
      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'login@uptoskills.com',
        password: 'Password123'
      });

      const cookie = loginRes.headers['set-cookie'];

      const meRes = await request(app).get('/api/auth/me').set('Cookie', cookie);
      expect(meRes.status).toBe(200);
      expect(meRes.body.user.email).toBe('login@uptoskills.com');
    });

    it('blocks unauthenticated access to protected routes', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('logs out and clears authentication cookie', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.headers['set-cookie'][0]).toContain('secureauth_token=;');
    });
  });

  describe('User Profile & Password Management', () => {
    let authCookie;

    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Profile Tester',
        email: 'profile@uptoskills.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      });

      const otp = '112233';
      await OtpVerification.deleteMany({ email: 'profile@uptoskills.com' });
      await OtpVerification.create({
        email: 'profile@uptoskills.com',
        otpHash: hashOtp(otp),
        purpose: OTP_PURPOSES.REGISTRATION,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      const verifyRes = await request(app).post('/api/auth/verify-email').send({
        email: 'profile@uptoskills.com',
        otp
      });

      authCookie = verifyRes.headers['set-cookie'];
    });

    it('fetches profile of authenticated user', async () => {
      const res = await request(app).get('/api/users/profile').set('Cookie', authCookie);
      expect(res.status).toBe(200);
      expect(res.body.user.name).toBe('Profile Tester');
      expect(res.body.user.email).toBe('profile@uptoskills.com');
    });

    it('updates profile and persists in MongoDB', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Cookie', authCookie)
        .send({
          name: 'Alex Morgan Updated',
          phone: '+1 (555) 234-5678',
          bio: 'Full-stack software engineer working on authentication.',
          location: 'San Francisco, CA'
        });

      expect(res.status).toBe(200);
      expect(res.body.user.name).toBe('Alex Morgan Updated');
      expect(res.body.user.phone).toBe('+1 (555) 234-5678');
      expect(res.body.user.bio).toContain('Full-stack');

      const user = await User.findOne({ email: 'profile@uptoskills.com' });
      expect(user.name).toBe('Alex Morgan Updated');
      expect(user.location).toBe('San Francisco, CA');
    });

    it('changes password with valid current password', async () => {
      const res = await request(app)
        .patch('/api/users/change-password')
        .set('Cookie', authCookie)
        .send({
          currentPassword: 'Password123',
          newPassword: 'NewSecurePassword456',
          confirmNewPassword: 'NewSecurePassword456'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify login with new password
      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'profile@uptoskills.com',
        password: 'NewSecurePassword456'
      });
      expect(loginRes.status).toBe(200);
    });

    it('rejects change password when current password is wrong', async () => {
      const res = await request(app)
        .patch('/api/users/change-password')
        .set('Cookie', authCookie)
        .send({
          currentPassword: 'IncorrectOldPassword',
          newPassword: 'NewSecurePassword456',
          confirmNewPassword: 'NewSecurePassword456'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Incorrect current password');
    });
  });

  describe('Forgot Password & Password Reset Flow', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Reset User',
        email: 'reset@uptoskills.com',
        password: 'OldPassword123',
        confirmPassword: 'OldPassword123'
      });

      const otp = '999999';
      await OtpVerification.deleteMany({ email: 'reset@uptoskills.com' });
      await OtpVerification.create({
        email: 'reset@uptoskills.com',
        otpHash: hashOtp(otp),
        purpose: OTP_PURPOSES.REGISTRATION,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      await request(app).post('/api/auth/verify-email').send({
        email: 'reset@uptoskills.com',
        otp
      });
    });

    it('generates a password recovery OTP without disclosing account existence', async () => {
      const res = await request(app).post('/api/auth/forgot-password').send({
        email: 'reset@uptoskills.com'
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const otpDoc = await OtpVerification.findOne({
        email: 'reset@uptoskills.com',
        purpose: OTP_PURPOSES.PASSWORD_RESET
      });
      expect(otpDoc).toBeDefined();
    });

    it('verifies reset OTP and resets password successfully', async () => {
      const resetOtp = '456789';
      await OtpVerification.create({
        email: 'reset@uptoskills.com',
        otpHash: hashOtp(resetOtp),
        purpose: OTP_PURPOSES.PASSWORD_RESET,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      // Verify OTP step
      const verifyRes = await request(app).post('/api/auth/verify-reset-otp').send({
        email: 'reset@uptoskills.com',
        otp: resetOtp
      });
      expect(verifyRes.status).toBe(200);

      // Perform reset step
      const resetRes = await request(app).post('/api/auth/reset-password').send({
        email: 'reset@uptoskills.com',
        otp: resetOtp,
        newPassword: 'BrandNewPassword999',
        confirmNewPassword: 'BrandNewPassword999'
      });

      expect(resetRes.status).toBe(200);
      expect(resetRes.body.success).toBe(true);

      // Verify login works with new password
      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'reset@uptoskills.com',
        password: 'BrandNewPassword999'
      });
      expect(loginRes.status).toBe(200);

      // Old password must fail
      const oldLoginRes = await request(app).post('/api/auth/login').send({
        email: 'reset@uptoskills.com',
        password: 'OldPassword123'
      });
      expect(oldLoginRes.status).toBe(401);
    });

    it('rejects password reset if new password is identical to old password', async () => {
      const resetOtp = '456789';
      await OtpVerification.create({
        email: 'reset@uptoskills.com',
        otpHash: hashOtp(resetOtp),
        purpose: OTP_PURPOSES.PASSWORD_RESET,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      const res = await request(app).post('/api/auth/reset-password').send({
        email: 'reset@uptoskills.com',
        otp: resetOtp,
        newPassword: 'OldPassword123',
        confirmNewPassword: 'OldPassword123'
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('different');
    });
  });
});

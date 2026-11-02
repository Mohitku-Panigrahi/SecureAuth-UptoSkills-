import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const verifyEmailSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  otp: z.string().trim().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must contain only numbers')
});

export const resendOtpSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  purpose: z.enum(['REGISTRATION', 'PASSWORD_RESET', 'EMAIL_CHANGE']).default('REGISTRATION')
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase()
});

export const verifyResetOtpSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  otp: z.string().trim().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must contain only numbers')
});

export const resetPasswordSchema = z
  .object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    otp: z.string().trim().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must contain only numbers'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword']
  });

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string().trim().max(20, 'Phone cannot exceed 20 characters').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional().or(z.literal('')),
  location: z.string().trim().max(100, 'Location cannot exceed 100 characters').optional().or(z.literal('')),
  dateOfBirth: z.string().optional().nullable().or(z.literal('')),
  profilePicture: z.string().max(2000000, 'Image data is too large (max ~2MB)').optional().or(z.literal(''))
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword']
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password cannot be the same as current password',
    path: ['newPassword']
  });

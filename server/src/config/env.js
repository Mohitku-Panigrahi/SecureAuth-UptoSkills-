import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory or root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/secureauth',
  jwtSecret: process.env.JWT_SECRET || 'secureauth_dev_super_secret_jwt_key_2026_xyz',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || (process.env.SMTP_USER ? `"SecureAuth Identity" <${process.env.SMTP_USER}>` : '"SecureAuth Identity" <no-reply@secureauth.io>')
  }
};

export const isSmtpConfigured = () => {
  return Boolean(config.smtp.user && config.smtp.pass && config.smtp.host);
};

export const validateEnv = () => {
  const warnings = [];
  if (!process.env.JWT_SECRET && config.nodeEnv === 'production') {
    throw new Error('FATAL: JWT_SECRET must be explicitly configured in production.');
  } else if (!process.env.JWT_SECRET) {
    warnings.push('JWT_SECRET is using a development default key.');
  }

  if (!isSmtpConfigured()) {
    warnings.push('Gmail SMTP is not configured. Email OTP delivery requires SMTP_USER and SMTP_PASS in .env.');
  }

  return { warnings };
};

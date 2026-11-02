import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const COOKIE_NAME = 'secureauth_token';

export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    return null;
  }
};

export const setAuthCookie = (res, token) => {
  const isProd = config.nodeEnv === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/'
  });
};

export const clearAuthCookie = (res) => {
  const isProd = config.nodeEnv === 'production';
  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    expires: new Date(0),
    path: '/'
  });
};

import { verifyToken, COOKIE_NAME } from '../utils/token.js';
import { User } from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    // 1. Extract token from HTTP-only cookie or Authorization header
    let token = req.cookies?.[COOKIE_NAME];
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    // 2. Verify token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.'
      });
    }

    // 3. Find authenticated user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this session no longer exists.'
      });
    }

    // 4. Ensure email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email address has not been verified yet.',
        isEmailVerified: false,
        email: user.email
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

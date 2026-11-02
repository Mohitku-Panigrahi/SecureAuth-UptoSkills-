import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All user routes require authentication
router.use(requireAuth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.patch('/change-password', changePassword);
router.delete('/account', deleteAccount);

export default router;

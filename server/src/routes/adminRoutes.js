import express from 'express';
import { User } from '../models/User.js';
import { OtpVerification } from '../models/OtpVerification.js';
import mongoose from 'mongoose';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

// Safe Admin Database Inspection Endpoint
router.get('/database', async (req, res) => {
  try {
    const users = await User.find({}).select('+passwordHash').lean();
    const otps = await OtpVerification.find({}).lean();

    return res.status(200).json({
      success: true,
      databaseName: mongoose.connection.name || 'secureauth',
      connectionStatus: getDbStatus(),
      connectionUri: mongoose.connection.host ? `mongodb://${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}` : 'In-Memory MongoDB Instance',
      stats: {
        totalUsers: users.length,
        totalOtpRecords: otps.length
      },
      collections: {
        users: users.map((u) => ({
          _id: u._id,
          name: u.name,
          email: u.email,
          passwordHash: u.passwordHash,
          isEmailVerified: u.isEmailVerified,
          phone: u.phone,
          bio: u.bio,
          location: u.location,
          dateOfBirth: u.dateOfBirth,
          directoryBadgeId: u.directoryBadgeId,
          organizationUnit: u.organizationUnit,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt
        })),
        otpverifications: otps.map((o) => ({
          _id: o._id,
          userId: o.userId,
          email: o.email,
          otpHash: o.otpHash,
          purpose: o.purpose,
          attempts: o.attempts,
          expiresAt: o.expiresAt,
          lastSentAt: o.lastSentAt,
          consumedAt: o.consumedAt,
          createdAt: o.createdAt
        }))
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to inspect database records',
      error: error.message
    });
  }
});

export default router;

import { User } from '../models/User.js';
import { OtpVerification } from '../models/OtpVerification.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { clearAuthCookie } from '../utils/token.js';
import { updateProfileSchema, changePasswordSchema } from '../utils/validation.js';

/**
 * Get current user's profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user's profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (validatedData.name !== undefined) user.name = validatedData.name;
    if (validatedData.phone !== undefined) user.phone = validatedData.phone;
    if (validatedData.bio !== undefined) user.bio = validatedData.bio;
    if (validatedData.location !== undefined) user.location = validatedData.location;
    if (validatedData.dateOfBirth !== undefined) {
      user.dateOfBirth = validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null;
    }
    if (validatedData.profilePicture !== undefined) {
      user.profilePicture = validatedData.profilePicture;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change Password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    const user = await User.findById(req.user._id).select('+passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password.'
      });
    }

    user.passwordHash = await hashPassword(newPassword);
    user.passwordChangedAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Account
 */
export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;

    // Delete user's active OTPs
    await OtpVerification.deleteMany({ email: userEmail });

    // Delete user from MongoDB
    await User.findByIdAndDelete(userId);

    // Clear session cookie
    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Your SecureAuth account has been permanently deleted.'
    });
  } catch (error) {
    next(error);
  }
};

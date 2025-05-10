import express from 'express';
import { 
  getMe,
  updateProfile
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

// @route   GET /api/profile/
// @desc    Get current logged in user
// @access  Private
router.get('/', protect, getMe);

// @route   PUT /api/profile/
// @desc    Update user profile
// @access  Private
router.put('/', protect, upload.single('profilePicture'), updateProfile);

export default router;

// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import config from '../config/config';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, rollNumber, password } = req.body;

    // Check if email is from IIT Patna domain
    if (!email.endsWith(config.emailDomain)) {
      return res.status(400).json({
        message: `Only IIT Patna email addresses are allowed (${config.emailDomain})`,
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { rollNumber }]
    });

    if (userExists) {
      return res.status(400).json({
        message: 'User with this email or roll number already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      rollNumber,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        token: user.getSignedJwtToken(),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Return token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      profilePicture: user.profilePicture,
      role: user.role,
      token: user.getSignedJwtToken(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      rollNumber: user?.rollNumber,
      profilePicture: user?.profilePicture,
      role: user?.role,
      createdAt: user?.createdAt,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields that are sent
    user.name = req.body.name || user.name;
    
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    // If user wants to change password
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      rollNumber: updatedUser.rollNumber,
      profilePicture: updatedUser.profilePicture,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
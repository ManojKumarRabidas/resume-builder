import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import moment from 'moment';

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json(user.profile);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Define date fields for each section of the profile
    const dateFields = {
      education: ['startDate', 'endDate'],
      experience: ['startDate', 'endDate'],
      certifications: ['date'],
    };
    // Function to convert date strings to Date objects
    function convertDates(data) {
      const newData = { ...data };
      for (const [section, fields] of Object.entries(dateFields)) {
        if (newData[section]) {
          newData[section] = newData[section].map(item => {
            const newItem = { ...item };
            fields.forEach(field => {
              if (newItem[field]) {
                // Parse the date string; adjust the format as needed (e.g., 'YYYY-MM-DD')
                const parsedDate = moment(newItem[field], 'YYYY-MM-DD').toDate();
                if (isNaN(parsedDate.getTime())) {
                  throw new Error(`Invalid date format for ${field} in ${section}`);
                }
                newItem[field] = parsedDate;
              }
            });
            return newItem;
          });
        }
      }
      return newData;
    }
    // Convert dates in the incoming request body
    const updatedProfile = convertDates(req.body);
    // Update profile fields
    user.profile = {
      ...user.profile,
      ...updatedProfile
    };

    // Update name if it's in the basic info
    if (updatedProfile.basic && updatedProfile.basic.name) {
      user.name = updatedProfile.basic.name;
    }

    await user.save();

    res.json({
      success: true,
      profile: user.profile
    });
  } catch (error) {
    next(error);
  }
});

export default router;
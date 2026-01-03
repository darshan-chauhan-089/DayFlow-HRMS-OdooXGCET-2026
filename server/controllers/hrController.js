import { upsertProfile, getProfileByUserId } from '../models/Profile.js';
import { createCheckIn, updateCheckOut, findAttendanceByUserId, getTodayAttendance } from '../models/Attendance.js';

// @desc    Update user profile
// @route   PUT /api/hr/profile/:id
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    // Allow users to update their own profile, or Admins to update anyone
    if (req.user.id != userId && req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile',
      });
    }

    const updatedProfile = await upsertProfile(userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/hr/profile/:id
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const profile = await getProfileByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: error.message,
    });
  }
};

// @desc    Check in attendance
// @route   POST /api/hr/attendance/checkin
// @access  Private
export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0]; // HH:MM:SS

    await createCheckIn(userId, date, time);

    res.status(201).json({
      success: true,
      message: 'Checked in successfully',
      data: { date, checkIn: time },
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error during check-in',
    });
  }
};

// @desc    Check out attendance
// @route   POST /api/hr/attendance/checkout
// @access  Private
export const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    await updateCheckOut(userId, date, time);

    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      data: { date, checkOut: time },
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error during check-out',
    });
  }
};

// @desc    Get attendance history
// @route   GET /api/hr/attendance/:id
// @access  Private
export const getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Authorization check
    if (req.user.id != userId && req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this attendance history',
      });
    }

    const history = await findAttendanceByUserId(userId);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance',
      error: error.message,
    });
  }
};

// @desc    Get today's status
// @route   GET /api/hr/attendance/status/today
// @access  Private
export const getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date().toISOString().split('T')[0];
    
    const record = await getTodayAttendance(userId, date);

    res.status(200).json({
      success: true,
      data: record || null,
    });
  } catch (error) {
    console.error('Get today status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

<<<<<<< Updated upstream
import { upsertProfile, getProfileByUserId, updateProfileAvatar } from '../models/Profile.js';
import { getAllUsersWithStatus, createUser, findByEmail, countUsersByYear } from '../models/User.js';
=======
import { upsertProfile, getProfileByUserId } from '../models/Profile.js';
>>>>>>> Stashed changes
import { 
  createCheckIn, 
  updateCheckOut, 
  recordBreak,
  findAttendanceByUserId, 
  findAttendanceByUserAndMonth,
  getTodayAttendance,
  getAllTodayAttendance,
  getMonthlyStats
} from '../models/Attendance.js';
<<<<<<< Updated upstream
import bcrypt from 'bcryptjs';
import { sendEmail } from '../config/email.js';
import { welcomeEmailTemplate } from '../utils/emailTemplates.js';

// Helper to generate Login ID
const generateLoginId = async (companyName, fullName) => {
  const companyCode = companyName ? companyName.substring(0, 2).toUpperCase() : 'XX';
  const names = fullName.trim().split(' ');
  const firstName = names[0] || '';
  const lastName = names.length > 1 ? names[names.length - 1] : firstName;
  const nameCode = (firstName.substring(0, 2) + lastName.substring(0, 2)).toUpperCase();
  const year = new Date().getFullYear();
  const count = await countUsersByYear(year);
  const serial = (count + 1).toString().padStart(4, '0');
  return `${companyCode}${nameCode}${year}${serial}`;
};

// Helper to generate random password
const generateRandomPassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};
=======
>>>>>>> Stashed changes

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

// @desc    Update user avatar
// @route   PUT /api/hr/profile/:id/avatar
// @access  Private
export const updateAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Allow users to update their own avatar, or Admins/HR to update anyone
    if (req.user.id != userId && req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this avatar',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    const updatedProfile = await updateProfileAvatar(userId, avatarPath);

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating avatar',
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
    const date = now.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
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
    const date = now.toLocaleDateString('en-CA');
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
    const date = new Date().toLocaleDateString('en-CA');
    
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

<<<<<<< Updated upstream
// @desc    Get all employees with their status
// @route   GET /api/hr/employees
// @access  Private (All authenticated users)
export const getAllEmployees = async (req, res) => {
  try {
    // Allow all authenticated users to view employee list
    const employees = await getAllUsersWithStatus();

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Add new employee (Admin/HR only)
// @route   POST /api/hr/employees/add
// @access  Private (Admin/HR)
export const addEmployee = async (req, res) => {
  try {
    // Check if user is Admin or HR
    if (req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add employees',
      });
    }

    const { 
      name, 
      email, 
      password, 
      phone, 
      department, 
      jobTitle, 
      salaryBase, 
      joiningDate 
    } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    // Check if user already exists
    const existingUser = await findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Get admin's company info
    const adminUser = req.user;
    const companyName = adminUser.companyName || 'Company';
    
    // Generate Login ID
    const empId = await generateLoginId(companyName, name);

    // Generate or use provided password
    const plainPassword = password || generateRandomPassword();
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    // Create user
    const newUser = await createUser({
      empId,
      name,
      companyName,
      companyLogo: adminUser.companyLogo || null,
      email,
      passwordHash,
      role: 'Employee',
    });

    // Create profile with additional info
    await upsertProfile(newUser.id, {
      phone: phone || null,
      department: department || null,
      jobTitle: jobTitle || null,
      salaryBase: salaryBase || null,
      joiningDate: joiningDate || new Date().toISOString().split('T')[0],
    });

    // Send welcome email with credentials
    try {
      await sendEmail({
        to: email,
        subject: `Welcome to ${companyName} - Your Account Details`,
        html: welcomeEmailTemplate(name, empId, email, plainPassword, companyName),
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the employee creation if email fails
    }

    // Get full profile data
    const employeeProfile = await getProfileByUserId(newUser.id);

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: employeeProfile,
    });
  } catch (error) {
    console.error('Add employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding employee',
      error: error.message,
    });
  }
};

// @desc    Upload a file
// @route   POST /api/hr/upload
// @access  Private
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      });
    }

    const filePath = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: { filePath },
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading file',
      error: error.message,
    });
  }
};

=======
>>>>>>> Stashed changes
// @desc    Record break time
// @route   POST /api/hr/attendance/break
// @access  Private
export const recordAttendanceBreak = async (req, res) => {
  try {
    const userId = req.user.id;
    const { breakStart, breakEnd } = req.body;
<<<<<<< Updated upstream
    const date = new Date().toLocaleDateString('en-CA');
=======
    const date = new Date().toISOString().split('T')[0];
>>>>>>> Stashed changes

    if (!breakStart || !breakEnd) {
      return res.status(400).json({
        success: false,
        message: 'Break start and end times are required',
      });
    }

    await recordBreak(userId, date, breakStart, breakEnd);

    res.status(200).json({
      success: true,
      message: 'Break recorded successfully',
      data: { date, breakStart, breakEnd },
    });
  } catch (error) {
    console.error('Record break error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error recording break',
    });
  }
};

// @desc    Get current month attendance for employee
// @route   GET /api/hr/attendance/month/current
// @access  Private
export const getCurrentMonthAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const records = await findAttendanceByUserAndMonth(userId, year, month);
    const stats = await getMonthlyStats(userId, year, month);

    res.status(200).json({
      success: true,
      month: `${month}-${year}`,
      data: records,
      stats: stats || {
        total_days: 0,
        present_days: 0,
        half_days: 0,
        absent_days: 0,
        leave_days: 0,
        total_working_hours: 0,
      },
    });
  } catch (error) {
    console.error('Get current month attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance',
      error: error.message,
    });
  }
};

// @desc    Get all employees attendance for today (Admin/HR only)
// @route   GET /api/hr/attendance/all/today
// @access  Private (Admin/HR)
export const getTodayAllEmployeesAttendance = async (req, res) => {
  try {
    // Check authorization
    if (req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view all employees attendance',
      });
    }

<<<<<<< Updated upstream
    const date = new Date().toLocaleDateString('en-CA');
=======
    const date = new Date().toISOString().split('T')[0];
>>>>>>> Stashed changes
    const records = await getAllTodayAttendance(date);

    res.status(200).json({
      success: true,
      date,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error('Get all today attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance',
      error: error.message,
    });
  }
};

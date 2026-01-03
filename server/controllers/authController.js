import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import {
  createUser,
  findByEmail,
  findByEmailOrEmpId,
  findById,
  findByResetToken,
  findByEmailAndOTP,
  setResetToken,
  clearResetToken,
  updatePassword,
  setOtp,
  clearOtp,
  countUsersByYear
} from '../models/User.js';
import { upsertProfile } from '../models/Profile.js';
import { sendEmail } from '../config/email.js';
import { otpEmailTemplate, passwordResetSuccessTemplate, welcomeEmailTemplate } from '../utils/emailTemplates.js';

// Helper to generate Login ID
const generateLoginId = async (companyName, fullName) => {
  // 1. Company Code (First 2 letters of Company Name)
  const companyCode = companyName ? companyName.substring(0, 2).toUpperCase() : 'XX';

  // 2. Name Code (First 2 letters of First Name + First 2 letters of Last Name)
  const names = fullName.trim().split(' ');
  const firstName = names[0] || '';
  const lastName = names.length > 1 ? names[names.length - 1] : firstName; // Fallback if no last name

  const nameCode = (firstName.substring(0, 2) + lastName.substring(0, 2)).toUpperCase();

  // 3. Year
  const year = new Date().getFullYear();

  // 4. Serial Number
  const count = await countUsersByYear(year);
  const serial = (count + 1).toString().padStart(4, '0');

  return `${companyCode}${nameCode}${year}${serial}`;
};

// @desc    Signup new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, companyName, phone } = req.body;
    const companyLogo = req.file ? `/uploads/${req.file.filename}` : null;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password)',
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

    // Generate Login ID (empId)
    const empId = await generateLoginId(companyName || 'OD', name);

    // Hash password and create new user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({
      empId,
      name,
      companyName,
      companyLogo,
      email,
      passwordHash,
      role: role || 'Employee',
    });

    // Create Profile with phone if provided (always create profile)
    await upsertProfile(user.id, { phone: phone || null });

    // Send welcome email with credentials
    try {
      await sendEmail({
        to: email,
        subject: `Welcome to ${companyName || 'DayFlow Human Resources Management System'} - Your Account Details`,
        html: welcomeEmailTemplate(name, empId, email, password, companyName),
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail signup if email fails
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        empId: user.empId,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        companyLogo: user.companyLogo,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/login ID and password',
      });
    }

    // Trim inputs
    email = email.trim();
    password = password.trim();

    // Find user and include password hash
    const user = await findByEmailOrEmpId(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        empId: user.empId,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        companyLogo: user.companyLogo,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};



// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    // Find user to verify current password
    const user = await findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await updatePassword(userId, hashedPassword);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password',
      error: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        empId: user.empId,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        companyLogo: user.companyLogo,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message,
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const user = await findByEmail(email);

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If that email exists, a password reset link has been sent',
      });
    }

    // Generate reset token and store hashed version
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await setResetToken(user.id, hashedToken, expiresAt);

    // In production, send email with reset link
    // For now, we'll just return the token (remove this in production)
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    console.log('🔑 Password Reset Token:', resetToken);
    console.log('🔗 Reset URL:', resetUrl);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
      // Remove in production - only for development
      resetToken,
      resetUrl,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending password reset email',
      error: error.message,
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const user = await findByResetToken(hashedToken);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Set new password
    const passwordHash = await bcrypt.hash(password, 10);
    await updatePassword(user.id, passwordHash);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message,
    });
  }
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const user = await findByEmail(email);

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If that email exists, an OTP has been sent',
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving
    const hashedOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await setOtp(user.id, hashedOTP, expiresAt);

    // Send OTP via email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset OTP',
        html: otpEmailTemplate(otp, user.name),
        text: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
      });

      res.status(200).json({
        success: true,
        message: 'OTP sent to your email',
      });
    } catch (emailError) {
      // If email fails, clear the OTP from database
      await clearOtp(user.id);

      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.',
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message,
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    // Hash OTP to compare with database
    const hashedOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    const user = await findByEmailAndOTP(email, hashedOTP);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message,
    });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password-otp
// @access  Public
export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP, and new password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash OTP to compare with database
    const hashedOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    const user = await findByEmailAndOTP(email, hashedOTP);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Set new password and clear OTP
    const passwordHash = await bcrypt.hash(password, 10);
    await updatePassword(user.id, passwordHash);

    // Send confirmation email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Successful',
        html: passwordResetSuccessTemplate(user.name),
        text: `Your password has been successfully reset. You can now log in with your new password.`,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password with OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message,
    });
  }
};

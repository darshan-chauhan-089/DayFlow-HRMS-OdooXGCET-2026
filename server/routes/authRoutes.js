import express from 'express';
import { signup, login, getProfile, forgotPassword, resetPassword, sendOTP, verifyOTP, resetPasswordWithOTP } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password-otp', resetPasswordWithOTP);

// Protected routes
router.get('/profile', authMiddleware, getProfile);

export default router;

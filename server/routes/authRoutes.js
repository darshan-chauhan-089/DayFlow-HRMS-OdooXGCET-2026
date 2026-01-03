import express from 'express';
import multer from 'multer';
import path from 'path';
import { signup, login, getProfile, forgotPassword, resetPassword, sendOTP, verifyOTP, resetPasswordWithOTP } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  },
});

// Public routes
router.post('/signup', upload.single('logo'), signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password-otp', resetPasswordWithOTP);

// Protected routes
router.get('/profile', authMiddleware, getProfile);

export default router;

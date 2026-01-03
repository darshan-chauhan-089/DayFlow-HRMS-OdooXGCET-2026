import express from 'express';
import { 
  updateProfile, 
  getUserProfile, 
  checkIn, 
  checkOut, 
  getAttendanceHistory,
  getTodayStatus
} from '../controllers/hrController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Profile Routes
router.put('/profile/:id', protect, updateProfile);
router.get('/profile/:id', protect, getUserProfile);

// Attendance Routes
router.post('/attendance/checkin', protect, checkIn);
router.post('/attendance/checkout', protect, checkOut);
router.get('/attendance/status/today', protect, getTodayStatus);
router.get('/attendance/:id', protect, getAttendanceHistory);

export default router;

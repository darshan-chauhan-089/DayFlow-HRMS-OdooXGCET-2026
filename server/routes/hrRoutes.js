import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  updateProfile, 
  getUserProfile,
  updateAvatar,
  addEmployee, 
  checkIn, 
  checkOut,
  recordAttendanceBreak,
  getAttendanceHistory,
  getTodayStatus,
  getAllEmployees,
  uploadFile,
  getCurrentMonthAttendance,
  getTodayAllEmployeesAttendance
} from '../controllers/hrController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `file-${Date.now()}-${file.originalname}`);
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

// Employee Directory
router.get('/employees', protect, getAllEmployees);
router.post('/employees/add', protect, addEmployee);
router.post('/upload', protect, upload.single('file'), uploadFile);

// Profile Routes
router.put('/profile/:id', protect, updateProfile);
router.get('/profile/:id', protect, getUserProfile);
router.put('/profile/:id/avatar', protect, upload.single('avatar'), updateAvatar);

// Attendance Routes
router.post('/attendance/checkin', protect, checkIn);
router.post('/attendance/checkout', protect, checkOut);
router.post('/attendance/break', protect, recordAttendanceBreak);
router.get('/attendance/status/today', protect, getTodayStatus);
router.get('/attendance/month/current', protect, getCurrentMonthAttendance);
router.get('/attendance/all/today', protect, getTodayAllEmployeesAttendance);
router.get('/attendance/:id', protect, getAttendanceHistory);

export default router;

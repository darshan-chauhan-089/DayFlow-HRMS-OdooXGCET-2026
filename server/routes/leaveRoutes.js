import express from 'express';
import { applyForLeave, getMyLeaves, getAllLeaves, updateStatus } from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Employee routes
router.post('/', protect, applyForLeave);
router.get('/', protect, getMyLeaves);

// Admin/HR routes
router.get('/all', protect, authorize('Admin', 'HR'), getAllLeaves);
router.put('/:id/status', protect, authorize('Admin', 'HR'), updateStatus);

export default router;

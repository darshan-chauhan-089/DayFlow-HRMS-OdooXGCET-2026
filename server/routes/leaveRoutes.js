import express from 'express';
import { 
  applyForLeave, 
  getMyLeaves, 
  getAllLeaves, 
  updateStatus, 
  getLeaveById, 
  addComment 
} from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin/HR routes - Protected by authorization middleware
// View all leave requests (MUST BE BEFORE /:id route)
router.get('/all', protect, authorize('Admin', 'HR'), getAllLeaves);

// Employee routes - Users can only see their own leaves
router.post('/', protect, applyForLeave);
router.get('/', protect, getMyLeaves);
router.get('/:id', protect, getLeaveById);

// Admin approval/rejection endpoints
router.put('/:id/status', protect, authorize('Admin', 'HR'), updateStatus);
router.put('/:id/comment', protect, authorize('Admin', 'HR'), addComment);

export default router;

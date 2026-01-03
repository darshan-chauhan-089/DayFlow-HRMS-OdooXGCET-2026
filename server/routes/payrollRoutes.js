import express from 'express';
import { 
  generateEmployeePayroll,
  getCurrentMonthPayroll,
  getPayrollHistory,
  getAllEmployeesPayroll,
  updatePayroll
} from '../controllers/payrollController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Payroll Routes
router.post('/generate', protect, generateEmployeePayroll);
router.get('/month/current', protect, getCurrentMonthPayroll);
router.get('/history', protect, getPayrollHistory);
router.get('/all/:year/:month', protect, getAllEmployeesPayroll);
router.put('/:id/status', protect, updatePayroll);

export default router;

import { 
  generatePayroll, 
  getPayrollByUserAndMonth,
  getUserPayrollHistory,
  getAllPayrollByMonth,
  updatePayrollStatus,
  updatePayrollDeductions
} from '../models/Payroll.js';

// @desc    Generate payroll for a user and month
// @route   POST /api/payroll/generate
// @access  Private (Admin/HR)
export const generateEmployeePayroll = async (req, res) => {
  try {
    // Check authorization
    if (req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to generate payroll',
      });
    }

    const { userId, year, month } = req.body;

    if (!userId || !year || !month) {
      return res.status(400).json({
        success: false,
        message: 'userId, year, and month are required',
      });
    }

    const payroll = await generatePayroll(userId, year, month);

    res.status(201).json({
      success: true,
      message: 'Payroll generated successfully',
      data: payroll,
    });
  } catch (error) {
    console.error('Generate payroll error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to generate payroll',
    });
  }
};

// @desc    Get payroll for current month
// @route   GET /api/payroll/month/current
// @access  Private
export const getCurrentMonthPayroll = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const payroll = await getPayrollByUserAndMonth(userId, year, month);

    res.status(200).json({
      success: true,
      data: payroll || null,
    });
  } catch (error) {
    console.error('Get current month payroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payroll',
      error: error.message,
    });
  }
};

// @desc    Get payroll history for employee
// @route   GET /api/payroll/history
// @access  Private
export const getPayrollHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await getUserPayrollHistory(userId);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error('Get payroll history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payroll history',
      error: error.message,
    });
  }
};

// @desc    Get all employees payroll for a month (Admin/HR only)
// @route   GET /api/payroll/all/:year/:month
// @access  Private (Admin/HR)
export const getAllEmployeesPayroll = async (req, res) => {
  try {
    // Check authorization
    if (req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view all payroll',
      });
    }

    const { year, month } = req.params;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'year and month are required',
      });
    }

    const payroll = await getAllPayrollByMonth(parseInt(year), parseInt(month));

    res.status(200).json({
      success: true,
      year,
      month,
      count: payroll.length,
      data: payroll,
    });
  } catch (error) {
    console.error('Get all payroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payroll',
      error: error.message,
    });
  }
};

// @desc    Update payroll status
// @route   PUT /api/payroll/:id/status
// @access  Private (Admin/HR)
export const updatePayroll = async (req, res) => {
  try {
    // Check authorization
    if (req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update payroll',
      });
    }

    const { id } = req.params;
    const { status, allowances = 0, deductions = 0 } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Payroll ID is required',
      });
    }

    // Update deductions if provided
    if (allowances !== 0 || deductions !== 0) {
      await updatePayrollDeductions(id, allowances, deductions);
    }

    // Update status if provided
    if (status) {
      await updatePayrollStatus(id, status);
    }

    res.status(200).json({
      success: true,
      message: 'Payroll updated successfully',
    });
  } catch (error) {
    console.error('Update payroll error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update payroll',
    });
  }
};

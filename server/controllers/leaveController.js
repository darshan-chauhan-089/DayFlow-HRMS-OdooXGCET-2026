import { createLeave, findLeavesByUserId, findAllLeaves, updateLeaveStatus } from '../models/Leave.js';

// @desc    Submit a leave request
// @route   POST /api/leaves
// @access  Private
export const applyForLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, remarks } = req.body;
    const userId = req.user.id;

    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide leave type, start date, and end date',
      });
    }

    const leaveId = await createLeave({ userId, leaveType, startDate, endDate, remarks });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      leaveId,
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting leave application',
      error: error.message,
    });
  }
};

// @desc    Get my leave history
// @route   GET /api/leaves
// @access  Private
export const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaves = await findLeavesByUserId(userId);

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    console.error('Get my leaves error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leave history',
      error: error.message,
    });
  }
};

// @desc    Get all leave requests (Admin)
// @route   GET /api/leaves/all
// @access  Private (Admin/HR)
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await findAllLeaves();

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    console.error('Get all leaves error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching all leaves',
      error: error.message,
    });
  }
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id/status
// @access  Private (Admin/HR)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const updated = await updateLeaveStatus(id, status);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating leave status',
      error: error.message,
    });
  }
};

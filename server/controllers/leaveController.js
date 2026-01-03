import { createLeave, findLeavesByUserId, findAllLeaves, updateLeaveStatus, findLeaveById, addAdminComment } from '../models/Leave.js';

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

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date',
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

// @desc    Get single leave request
// @route   GET /api/leaves/:id
// @access  Private
export const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await findLeaveById(id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    console.error('Get leave by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leave request',
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
    const { status, adminComments } = req.body;

    // Debug logging
    console.log('=== UPDATE STATUS REQUEST ===');
    console.log('Leave ID:', id);
    console.log('Status:', status);
    console.log('Comments:', adminComments);
    console.log('User Role:', req.user?.role);
    console.log('User ID:', req.user?.id);

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const updated = await updateLeaveStatus(id, status, adminComments);

    console.log('Update result:', updated);

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
    console.error('=== UPDATE LEAVE STATUS ERROR ===');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Full Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating leave status',
      error: error.message,
    });
  }
};

// @desc    Add admin comment to leave request
// @route   PUT /api/leaves/:id/comment
// @access  Private (Admin/HR)
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty',
      });
    }

    const updated = await addAdminComment(id, comment);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding comment',
      error: error.message,
    });
  }
};

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaCheck, 
  FaTimes, 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaPlus,
  FaCalendarAlt,
  FaComment,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaExclamationCircle,
  FaInfoCircle,
  FaClipboard
} from 'react-icons/fa';
import api from '../services/api';

const Leave = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'HR';

  // State management
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Comment modal state
  const [showCommentModal, setShowCommentModal] = useState({ open: false, action: null, leaveId: null });
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    leaveType: 'Paid',
    startDate: '',
    endDate: '',
    remarks: ''
  });

  // Fetch leaves on component mount
  useEffect(() => {
    fetchLeaves();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const fetchLeaves = async () => {
    setLoading(true);
    setError('');
    try {
      // Users see only their leaves, admins see all
      const endpoint = isAdmin ? '/leaves/all' : '/leaves';
      const response = await api.get(endpoint);
      if (response.data.success) {
        setRequests(response.data.data || []);
      }
    } catch (err) {
      setError('Failed to load leave requests: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Get user avatar - uses initials if no image available
  const getAvatarUrl = (userName, userEmail) => {
    const initials = (userName || 'User')
      .split(' ')
      .map(n => n.charAt(0).toUpperCase())
      .join('');
    
    // Create a simple avatar with initials using a placeholder service
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=714B67&color=ffffff&size=56&font-size=0.33&bold=true`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/leaves', {
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        remarks: formData.remarks
      });

      if (response.data.success) {
        setSuccessMsg('Leave request submitted successfully!');
        setShowForm(false);
        setFormData({ leaveType: 'Paid', startDate: '', endDate: '', remarks: '' });
        fetchLeaves();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!commentText.trim()) {
      setError('Please add a comment before approving');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await api.put(`/leaves/${id}/status`, {
        status: 'Approved',
        adminComments: commentText
      });

      if (response.data.success) {
        setSuccessMsg('Leave request approved successfully!');
        setCommentText('');
        setShowCommentModal(false);
        setSelectedLeaveId(null);
        fetchLeaves();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve leave');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!commentText.trim()) {
      setError('Please add a reason for rejection');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await api.put(`/leaves/${id}/status`, {
        status: 'Rejected',
        adminComments: commentText
      });

      if (response.data.success) {
        setSuccessMsg('Leave request rejected successfully!');
        setCommentText('');
        setShowCommentModal(false);
        setSelectedLeaveId(null);
        fetchLeaves();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject leave');
    } finally {
      setLoading(false);
    }
  };

  const openCommentModal = (leaveId, action = 'approve') => {
    setSelectedLeaveId(leaveId);
    const leave = requests.find(r => r.id === leaveId);
    setCommentText(leave?.adminComments || '');
    setShowCommentModal({ open: true, action, leaveId });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return days === 1 ? '1 Day' : `${days} Days`;
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Approved': 'bg-green-100 text-green-800 border border-green-200',
      'Pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'Rejected': 'bg-red-100 text-red-800 border border-red-200',
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getLeaveTypeColor = (type) => {
    const colors = {
      'Paid': 'bg-blue-50 border-blue-200',
      'Sick': 'bg-orange-50 border-orange-200',
      'Unpaid': 'bg-purple-50 border-purple-200',
      'Casual': 'bg-indigo-50 border-indigo-200',
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.leaveType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#714B67] to-[#5d3d54] text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">Leave & Time-Off Management</h1>
        <p className="text-gray-100">Manage leave requests and approvals</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Success Alert */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-green-600 hover:text-green-800">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="odoo-btn-primary flex items-center gap-2"
          >
            <FaPlus size={12} /> {showForm ? 'Cancel' : 'New Request'}
          </button>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search employee/type..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#714B67]"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Create Form (Collapsible) */}
      {showForm && (
        <div className="odoo-card p-6 animate-fade-in-down border-l-4 border-[#714B67]">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-[#714B67]" /> Apply for Leave
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Name (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name</label>
              <input
                type="text"
                value={user?.name || 'Loading...'}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 font-semibold cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#714B67] focus:border-[#714B67] focus:outline-none"
              >
                <option value="Paid">Paid Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            {/* Start and End Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#714B67] focus:border-[#714B67] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#714B67] focus:border-[#714B67] focus:outline-none"
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks / Reason</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#714B67] focus:border-[#714B67] focus:outline-none resize-none"
                placeholder="Please provide reason for leave..."
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setFormData({ leaveType: 'Paid', startDate: '', endDate: '', remarks: '' });
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Discard
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-4 py-2 text-white bg-[#714B67] rounded-md hover:bg-[#5d3d54] disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Data Table */}
      <div className="odoo-card overflow-hidden shadow-lg">
        {loading && requests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Loading leave requests...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#714B67] to-[#5d3d54] text-white text-xs uppercase font-bold tracking-wider sticky top-0 shadow-md">
                    <th className="px-6 py-4 min-w-40">Employee</th>
                    <th className="px-6 py-4 min-w-28">Type</th>
                    <th className="px-6 py-4 min-w-32">Duration</th>
                    <th className="px-6 py-4 min-w-56">Dates</th>
                    <th className="px-6 py-4 min-w-32">Status</th>
                    {isAdmin && <th className="px-6 py-4 text-center min-w-28">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 text-sm border-b border-gray-100">
                      {/* Employee Name with Email */}
                      <td className="px-6 py-5 align-middle">
                        <div className="font-bold text-gray-900">{req.userName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{req.userEmail}</div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-5 align-middle">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block whitespace-nowrap ${getLeaveTypeColor(req.leaveType)}`}>
                          {req.leaveType}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-5 align-middle">
                        <span className="font-bold text-[#714B67] bg-purple-100 px-3 py-1.5 rounded-lg inline-block text-sm whitespace-nowrap">
                          {calculateDuration(req.startDate, req.endDate)} Days
                        </span>
                      </td>

                      {/* Dates Range */}
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                          <span className="whitespace-nowrap">
                            {new Date(req.startDate).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                          </span>
                          <span className="text-gray-400">to</span>
                          <span className="whitespace-nowrap">
                            {new Date(req.endDate).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5 align-middle">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap ${getStatusBadge(req.status)}`}>
                          {req.status === 'Approved' && <FaCheck size={10} />}
                          {req.status === 'Rejected' && <FaTimes size={10} />}
                          {req.status === 'Pending' && <FaExclamationCircle size={10} />}
                          {req.status}
                        </span>
                      </td>

                      {/* Actions - Admin Only */}
                      {isAdmin && (
                        <td className="px-6 py-5 text-center align-middle">
                          {req.status === 'Pending' ? (
                            <div className="flex justify-center items-center gap-3">
                              <button
                                onClick={() => openCommentModal(req.id, 'approve')}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 transition-all duration-200 hover:scale-110"
                                title="Approve"
                              >
                                <FaCheck size={14} />
                              </button>
                              <button
                                onClick={() => openCommentModal(req.id, 'reject')}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-all duration-200 hover:scale-110"
                                title="Reject"
                              >
                                <FaTimes size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs font-semibold">
                              {req.status === 'Approved' ? '✓ Approved' : '✗ Rejected'}
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}

                  {/* No Results */}
                  {filteredRequests.length === 0 && !loading && (
                    <tr>
                      <td colSpan={isAdmin ? "6" : "5"} className="p-12 text-center">
                        <FaCalendarAlt className="inline text-4xl text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium mt-3">
                          {isAdmin ? 'No leave requests found' : 'You have not applied for any leave yet'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {filteredRequests.length > 0 && (
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-[#714B67] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm">
                <span className="font-bold text-gray-800">
                  📊 Showing <span className="text-[#714B67]">{filteredRequests.length}</span> of <span className="text-[#714B67]">{requests.length}</span> requests
                </span>
                <div className="flex flex-wrap gap-4 text-xs font-medium">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-green-200">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span> Approved
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-yellow-200">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Pending
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-red-200">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span> Rejected
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Comment Modal */}
      {showCommentModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in-down border-t-4 ${
            showCommentModal.action === 'approve' ? 'border-green-500' : 'border-red-500'
          }`}>
            {/* Header */}
            <div className={`flex items-center gap-3 mb-4 pb-4 border-b-2 ${
              showCommentModal.action === 'approve' ? 'border-green-200' : 'border-red-200'
            }`}>
              <div className={`p-3 rounded-lg ${
                showCommentModal.action === 'approve' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {showCommentModal.action === 'approve' ? (
                  <FaCheck className="text-green-600" size={24} />
                ) : (
                  <FaTimes className="text-red-600" size={24} />
                )}
              </div>
              <div>
                <h3 className={`text-xl font-bold ${
                  showCommentModal.action === 'approve' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {showCommentModal.action === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {showCommentModal.action === 'approve' 
                ? 'Please add any comments or remarks to include with this approval.' 
                : 'Please provide a detailed reason for rejecting this leave request.'}
            </p>
            
            {/* Textarea */}
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="5"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#714B67] focus:border-[#714B67] focus:outline-none resize-none text-sm font-medium placeholder-gray-400 transition-all duration-200"
              placeholder={showCommentModal.action === 'approve' 
                ? 'Leave is approved as per policy...' 
                : 'Reason: This conflicts with project deadline...'}
            ></textarea>

            {/* Character Count */}
            <div className="text-xs text-gray-500 mt-2 text-right">
              {commentText.length} characters
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => {
                  setShowCommentModal({ open: false, action: null, leaveId: null });
                  setCommentText('');
                }}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-bold transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>

              {showCommentModal.action === 'approve' ? (
                <button
                  onClick={() => handleApprove(showCommentModal.leaveId)}
                  disabled={loading || !commentText.trim()}
                  className="px-6 py-3 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center gap-2 transition-all duration-200 transform hover:scale-105 border-2 border-green-700"
                >
                  <FaCheck size={16} /> {loading ? 'Approving...' : 'Approve'}
                </button>
              ) : (
                <button
                  onClick={() => handleReject(showCommentModal.leaveId)}
                  disabled={loading || !commentText.trim()}
                  className="px-6 py-3 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center gap-2 transition-all duration-200 transform hover:scale-105 border-2 border-red-700"
                >
                  <FaTimes size={16} /> {loading ? 'Rejecting...' : 'Reject'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;

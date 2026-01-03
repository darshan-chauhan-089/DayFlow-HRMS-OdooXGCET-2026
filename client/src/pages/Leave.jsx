import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaCheck, 
  FaTimes, 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaPlus,
  FaCalendarAlt
} from 'react-icons/fa';

const Leave = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'HR';

  // State for Leave Application Form visibility
  const [showForm, setShowForm] = useState(false);

  // State for Leave Application Form
  const [formData, setFormData] = useState({
    leaveType: 'Paid',
    startDate: '',
    endDate: '',
    remarks: ''
  });

  // Mock Data for Leave Requests
  const [requests, setRequests] = useState([
    { id: 1, employee: 'John Doe', type: 'Sick', startDate: '2023-10-25', endDate: '2023-10-26', duration: '2 Days', remarks: 'Flu', status: 'Pending' },
    { id: 2, employee: 'Jane Smith', type: 'Paid', startDate: '2023-11-01', endDate: '2023-11-05', duration: '5 Days', remarks: 'Vacation', status: 'Approved' },
    { id: 3, employee: 'Mike Ross', type: 'Unpaid', startDate: '2023-11-10', endDate: '2023-11-10', duration: '1 Day', remarks: 'Personal', status: 'Rejected' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    const newRequest = {
      id: requests.length + 1,
      employee: user?.name || 'Current User',
      type: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: '3 Days', // Mock calculation
      remarks: formData.remarks,
      status: 'Pending'
    };
    setRequests([newRequest, ...requests]);
    setShowForm(false);
    setFormData({ leaveType: 'Paid', startDate: '', endDate: '', remarks: '' });
  };

  const handleAction = (id, action) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: action === 'approve' ? 'Approved' : 'Rejected' } : req
    ));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800 border border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const filteredRequests = requests.filter(req => 
    req.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="odoo-btn-primary flex items-center gap-2"
          >
            <FaPlus size={12} /> {showForm ? 'Cancel' : 'New Request'}
          </button>
          <button className="odoo-btn-secondary flex items-center gap-2">
            <FaDownload size={12} /> Export
          </button>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search leaves..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md border border-gray-300">
            <FaFilter />
          </button>
        </div>
      </div>

      {/* Create Form (Collapsible) */}
      {showForm && (
        <div className="odoo-card p-6 animate-fade-in-down">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-[#714B67]" /> New Leave Request
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#714B67] focus:border-[#714B67]"
              >
                <option value="Paid">Paid Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#714B67] focus:border-[#714B67]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#714B67] focus:border-[#714B67]"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#714B67] focus:border-[#714B67]"
                placeholder="Reason for leave..."
              ></textarea>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Discard
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 text-white bg-[#714B67] rounded-md hover:bg-[#5d3d54]"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Data Table */}
      <div className="odoo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                <th className="p-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-[#714B67] focus:ring-[#714B67]" />
                </th>
                <th className="p-4">Employee</th>
                <th className="p-4">Type</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Status</th>
                {isAdmin && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-gray-300 text-[#714B67] focus:ring-[#714B67]" />
                  </td>
                  <td className="p-4 font-medium text-gray-900">{req.employee}</td>
                  <td className="p-4">{req.type}</td>
                  <td className="p-4">{req.duration}</td>
                  <td className="p-4 text-gray-500 text-xs">
                    {req.startDate} <span className="mx-1">to</span> {req.endDate}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="p-4 text-right">
                      {req.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleAction(req.id, 'approve')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded border border-green-200"
                            title="Approve"
                          >
                            <FaCheck size={12} />
                          </button>
                          <button 
                            onClick={() => handleAction(req.id, 'reject')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200"
                            title="Reject"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="p-8 text-center text-gray-500">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Mock) */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
          <span>Showing 1 to {filteredRequests.length} of {filteredRequests.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;

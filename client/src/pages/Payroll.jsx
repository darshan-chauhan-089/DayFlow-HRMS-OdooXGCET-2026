import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  FaMoneyBillWave, 
  FaCalendar, 
  FaClock, 
  FaUsers, 
  FaDownload, 
  FaSyncAlt,
  FaEdit,
  FaCheck,
  FaBan
} from 'react-icons/fa';

const Payroll = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'HR';
  
  const [viewMode, setViewMode] = useState('employee'); // 'employee' or 'admin'
  const [currentPayroll, setCurrentPayroll] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [allEmployeesPayroll, setAllEmployeesPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch data based on current view
  useEffect(() => {
    fetchData();
  }, [viewMode, selectedYear, selectedMonth]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (viewMode === 'employee') {
        // Fetch current month payroll
        const currentRes = await api.get('/payroll/month/current');
        if (currentRes.data.success) {
          setCurrentPayroll(currentRes.data.data);
        }

        // Fetch payroll history
        const historyRes = await api.get('/payroll/history');
        if (historyRes.data.success) {
          setPayrollHistory(historyRes.data.data || []);
        }
      } else if (isAdmin) {
        // Fetch all employees payroll for selected month
        const allRes = await api.get(`/payroll/all/${selectedYear}/${selectedMonth}`);
        if (allRes.data.success) {
          setAllEmployeesPayroll(allRes.data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching payroll:', error);
      toast.error('Failed to fetch payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayroll = async (userId) => {
    try {
      const response = await api.post('/payroll/generate', {
        userId,
        year: selectedYear,
        month: selectedMonth,
      });

      if (response.data.success) {
        toast.success('Payroll generated successfully');
        fetchData(); // Refresh data
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate payroll');
    }
  };

  const handleUpdatePayroll = async (payrollId, status, allowances = 0, deductions = 0) => {
    try {
      const response = await api.put(`/payroll/${payrollId}/status`, {
        status,
        allowances,
        deductions,
      });

      if (response.data.success) {
        toast.success('Payroll updated successfully');
        setShowEditModal(false);
        setEditingPayroll(null);
        fetchData(); // Refresh data
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update payroll');
    }
  };

  const openEditModal = (payroll) => {
    setEditingPayroll({
      id: payroll.id,
      allowances: payroll.allowances || 0,
      deductions: payroll.deductions || 0,
      status: payroll.status,
    });
    setShowEditModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'generated':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#714B67]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role Toggle (only for admins) */}
      {isAdmin && (
        <div className="flex gap-2 bg-white p-4 rounded-lg border border-gray-200">
          <button
            onClick={() => setViewMode('employee')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === 'employee' 
                ? 'bg-[#714B67] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            My Payroll
          </button>
          <button
            onClick={() => setViewMode('admin')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === 'admin' 
                ? 'bg-[#714B67] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manage Payroll
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <FaMoneyBillWave className="text-green-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">
            {viewMode === 'employee' ? 'My Payroll' : 'Payroll Management'}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {viewMode === 'admin' && (
            <>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </>
          )}
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <FaSyncAlt size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Employee View */}
      {viewMode === 'employee' && (
        <>
          {/* Current Month Payroll Card */}
          {currentPayroll ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                      Current Month Net Salary
                    </p>
                    <h2 className="text-4xl font-bold text-gray-800 mt-1">
                      ₹{currentPayroll.net_salary?.toLocaleString()}
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                      {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(currentPayroll.status)}`}>
                      {currentPayroll.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Attendance Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Working Days:</span>
                      <span className="font-medium">{currentPayroll.total_working_days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Present Days:</span>
                      <span className="font-medium text-green-600">{currentPayroll.present_days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Half Days:</span>
                      <span className="font-medium text-orange-600">{currentPayroll.half_days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Absent Days:</span>
                      <span className="font-medium text-red-600">{currentPayroll.absent_days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid Leave Days:</span>
                      <span className="font-medium text-blue-600">{currentPayroll.paid_leave_days}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-700 font-semibold">Payable Days:</span>
                      <span className="font-bold text-[#714B67]">{currentPayroll.payable_days}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Salary Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Basic Salary:</span>
                      <span className="font-medium">₹{currentPayroll.basic_salary?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Per Day Rate:</span>
                      <span className="font-medium">₹{currentPayroll.per_day_rate?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Salary:</span>
                      <span className="font-medium text-green-600">₹{currentPayroll.gross_salary?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allowances:</span>
                      <span className="font-medium text-green-600">+₹{currentPayroll.allowances?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deductions:</span>
                      <span className="font-medium text-red-600">-₹{currentPayroll.deductions?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-700 font-semibold">Net Salary:</span>
                      <span className="font-bold text-[#714B67]">₹{currentPayroll.net_salary?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No payroll data available for current month</p>
            </div>
          )}

          {/* Payroll History */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Payroll History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                    <th className="p-4">Month/Year</th>
                    <th className="p-4">Basic Salary</th>
                    <th className="p-4">Working Days</th>
                    <th className="p-4">Payable Days</th>
                    <th className="p-4">Net Salary</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payrollHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                      <td className="p-4 font-medium">
                        {monthNames[record.month - 1]} {record.year}
                      </td>
                      <td className="p-4">₹{record.basic_salary?.toLocaleString()}</td>
                      <td className="p-4">{record.total_working_days}</td>
                      <td className="p-4">{record.payable_days}</td>
                      <td className="p-4 font-semibold">₹{record.net_salary?.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {payrollHistory.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">
                        No payroll history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Admin View */}
      {viewMode === 'admin' && isAdmin && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Employee Payroll - {monthNames[selectedMonth - 1]} {selectedYear}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Showing payroll for {allEmployeesPayroll.length} employees
              </p>
            </div>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-[#714B67] text-white rounded-md hover:bg-[#5d3d54] transition-colors flex items-center gap-2"
            >
              <FaDownload size={14} /> Generate Report
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Basic Salary</th>
                  <th className="p-4">Payable Days</th>
                  <th className="p-4">Net Salary</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allEmployeesPayroll.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{record.name}</div>
                        <div className="text-xs text-gray-500">{record.emp_id}</div>
                      </div>
                    </td>
                    <td className="p-4">{record.department || '-'}</td>
                    <td className="p-4">₹{record.basic_salary?.toLocaleString()}</td>
                    <td className="p-4">{record.payable_days}</td>
                    <td className="p-4 font-semibold">₹{record.net_salary?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(record)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Payroll"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleUpdatePayroll(record.id, 'Paid')}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Mark as Paid"
                        >
                          <FaCheck size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {allEmployeesPayroll.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No payroll records found for {monthNames[selectedMonth - 1]} {selectedYear}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Payroll Modal */}
      {showEditModal && editingPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Payroll</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowances
                </label>
                <input
                  type="number"
                  value={editingPayroll.allowances}
                  onChange={(e) => setEditingPayroll({
                    ...editingPayroll,
                    allowances: parseFloat(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deductions
                </label>
                <input
                  type="number"
                  value={editingPayroll.deductions}
                  onChange={(e) => setEditingPayroll({
                    ...editingPayroll,
                    deductions: parseFloat(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editingPayroll.status}
                  onChange={(e) => setEditingPayroll({
                    ...editingPayroll,
                    status: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
                >
                  <option value="Pending">Pending</option>
                  <option value="Generated">Generated</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleUpdatePayroll(
                  editingPayroll.id,
                  editingPayroll.status,
                  editingPayroll.allowances,
                  editingPayroll.deductions
                )}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
              >
                Update Payroll
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPayroll(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;

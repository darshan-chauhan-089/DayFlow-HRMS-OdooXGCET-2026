import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  FaCalendarCheck, 
  FaClock, 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaSearch, 
  FaFilter, 
  FaDownload,
  FaPlus,
  FaCoffee
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Attendance = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('employee'); // 'employee' or 'admin'
  const [attendanceData, setAttendanceData] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [searchTerm, setSearchTerm] = useState('');
  const [breakStart, setBreakStart] = useState(null);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [adminAttendance, setAdminAttendance] = useState([]);

  // Check if user is admin/HR
  const isAdmin = user?.role === 'Admin' || user?.role === 'HR';

  // Update timer for current session duration
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        
        // Get today's record
        const todayRes = await api.get('/hr/attendance/status/today');
        if (todayRes.data.success && todayRes.data.data) {
          setTodayRecord(todayRes.data.data);
        }

        if (viewMode === 'employee') {
          // Get current month attendance for employee
          const monthRes = await api.get('/hr/attendance/month/current');
          if (monthRes.data.success) {
            setAttendanceData(monthRes.data.data || []);
            setStats(monthRes.data.stats || {});
          }
        } else if (isAdmin) {
          // Get all employees attendance for today
          const adminRes = await api.get('/hr/attendance/all/today');
          if (adminRes.data.success) {
            setAdminAttendance(adminRes.data.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        toast.error('Failed to fetch attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
    const interval = setInterval(fetchAttendance, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [viewMode, isAdmin]);

  const handleCheckIn = async () => {
    try {
      const response = await api.post('/hr/attendance/checkin');
      if (response.data.success) {
        toast.success('Checked in successfully');
        setTodayRecord(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await api.post('/hr/attendance/checkout');
      if (response.data.success) {
        toast.success('Checked out successfully');
        // Refresh today's record
        const todayRes = await api.get('/hr/attendance/status/today');
        if (todayRes.data.success) {
          setTodayRecord(todayRes.data.data);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-out failed');
    }
  };

  const handleBreakStart = () => {
    setBreakStart(new Date());
    setShowBreakModal(true);
    toast.success('Break started');
  };

  const handleBreakEnd = async () => {
    if (!breakStart) {
      toast.error('No active break');
      return;
    }

    try {
      const breakStartStr = breakStart.toTimeString().split(' ')[0];
      const breakEndStr = new Date().toTimeString().split(' ')[0];
      
      const response = await api.post('/hr/attendance/break', {
        breakStart: breakStartStr,
        breakEnd: breakEndStr,
      });

      if (response.data.success) {
        toast.success('Break recorded successfully');
        setBreakStart(null);
        setShowBreakModal(false);
        // Refresh today's record
        const todayRes = await api.get('/hr/attendance/status/today');
        if (todayRes.data.success) {
          setTodayRecord(todayRes.data.data);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record break');
    }
  };

  const duration = todayRecord?.check_in && !todayRecord?.check_out 
    ? Math.max(0, now - new Date(`2000-01-01 ${todayRecord.check_in}`).getTime()) 
    : 0;
  const durationStr = new Date(duration).toISOString().substring(11, 19);

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'present': return 'bg-green-100 text-green-800 border border-green-200';
      case 'half day': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'absent': return 'bg-red-100 text-red-800 border border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'on leave': return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const employeeRows = useMemo(() => {
    return attendanceData
      .map((record) => ({
        id: record.id,
        date: new Date(record.date).toLocaleDateString('en-US', { 
          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
        }),
        checkIn: record.check_in || '-',
        checkOut: record.check_out || '-',
        breakDuration: record.break_duration_minutes ? `${record.break_duration_minutes} mins` : '-',
        workHours: record.working_hours ? `${record.working_hours} hrs` : '-',
        status: record.status || 'Absent',
      }))
      .filter(row => 
        row.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [attendanceData, searchTerm]);

  const adminRows = useMemo(() => {
    return adminAttendance
      .map((record) => ({
        id: record.id,
        empId: record.emp_id || '-',
        name: record.name || '-',
        department: record.department || '-',
        jobTitle: record.job_title || '-',
        checkIn: record.check_in || '-',
        checkOut: record.check_out || '-',
        workHours: record.working_hours ? `${record.working_hours} hrs` : '-',
        status: record.status || 'Absent',
      }))
      .filter(row => 
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [adminAttendance, searchTerm]);

  if (loading && viewMode === 'employee') {
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
            My Attendance
          </button>
          <button
            onClick={() => setViewMode('admin')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === 'admin' 
                ? 'bg-[#714B67] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Employees (Today)
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="odoo-btn-secondary flex items-center gap-2">
            <FaDownload size={12} /> Export
          </button>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder={viewMode === 'employee' ? 'Search attendance...' : 'Search employee...'} 
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

      {/* Employee View */}
      {viewMode === 'employee' && (
        <>
          {/* Today's Status Card */}
          <div className="odoo-card p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Today's Attendance</h2>
              <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Current Session</div>
                <div className="text-2xl font-mono font-bold text-[#714B67]">{durationStr}</div>
              </div>

              <div className="h-10 w-px bg-gray-200"></div>

              <div className="flex gap-3 flex-wrap">
                {!todayRecord?.check_in ? (
                  <button 
                    onClick={handleCheckIn} 
                    className="px-6 py-2.5 bg-[#00A09D] hover:bg-[#008a87] text-white rounded-md font-medium shadow-sm transition-colors flex items-center gap-2"
                  >
                    <FaSignInAlt /> Check In
                  </button>
                ) : !todayRecord?.check_out ? (
                  <>
                    <button 
                      onClick={handleBreakStart} 
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium shadow-sm transition-colors flex items-center gap-2 text-sm"
                    >
                      <FaCoffee size={14} /> Break
                    </button>
                    <button 
                      onClick={handleCheckOut} 
                      className="px-6 py-2.5 bg-[#714B67] hover:bg-[#5d3d54] text-white rounded-md font-medium shadow-sm transition-colors flex items-center gap-2"
                    >
                      <FaSignOutAlt /> Check Out
                    </button>
                  </>
                ) : (
                  <span className="px-6 py-2.5 bg-green-100 text-green-700 rounded-md font-medium border border-green-200 flex items-center gap-2">
                    <FaCalendarCheck /> Completed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Stats Card */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="odoo-card p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{stats.present_days || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Present</div>
              </div>
              <div className="odoo-card p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.half_days || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Half Days</div>
              </div>
              <div className="odoo-card p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.absent_days || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Absent</div>
              </div>
              <div className="odoo-card p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.leave_days || 0}</div>
                <div className="text-xs text-gray-500 mt-1">On Leave</div>
              </div>
              <div className="odoo-card p-4 text-center md:col-span-2">
                <div className="text-2xl font-bold text-[#714B67]">{stats.total_working_hours || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Total Hours</div>
              </div>
            </div>
          )}

          {/* Employee Attendance Table */}
          <div className="odoo-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                    <th className="p-4">Date</th>
                    <th className="p-4">Check In</th>
                    <th className="p-4">Check Out</th>
                    <th className="p-4">Break Duration</th>
                    <th className="p-4">Work Hours</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employeeRows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                      <td className="p-4 font-medium">{row.date}</td>
                      <td className="p-4">{row.checkIn}</td>
                      <td className="p-4">{row.checkOut}</td>
                      <td className="p-4">{row.breakDuration}</td>
                      <td className="p-4">{row.workHours}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {employeeRows.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">
                        No attendance records found.
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
        <div className="odoo-card overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              All Employees Attendance - {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Showing {adminRows.length} employees present today</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                  <th className="p-4">Emp ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Job Title</th>
                  <th className="p-4">Check In</th>
                  <th className="p-4">Check Out</th>
                  <th className="p-4">Work Hours</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {adminRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    <td className="p-4 font-medium">{row.empId}</td>
                    <td className="p-4">{row.name}</td>
                    <td className="p-4">{row.department}</td>
                    <td className="p-4">{row.jobTitle}</td>
                    <td className="p-4">{row.checkIn}</td>
                    <td className="p-4">{row.checkOut}</td>
                    <td className="p-4">{row.workHours}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {adminRows.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500">
                      No employees present today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Break Modal */}
      {showBreakModal && breakStart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Break Time</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Break Started At:</p>
                <p className="text-2xl font-mono font-bold text-[#714B67]">
                  {breakStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleBreakEnd}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
                >
                  End Break
                </button>
                <button
                  onClick={() => {
                    setShowBreakModal(false);
                    setBreakStart(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

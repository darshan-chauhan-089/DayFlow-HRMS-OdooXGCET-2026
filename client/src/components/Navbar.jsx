import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaUserCircle, FaSignOutAlt, FaRegUser, FaChevronDown, FaHome, FaCalendarCheck, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({
    status: 'Absent',
    checkInTime: null,
  });
  const dropdownRef = useRef(null);

  const fetchTodayStatus = async () => {
    try {
      const { data } = await api.get('/hr/attendance/status/today');
      if (data.data) {
        setAttendanceStatus({
          status: data.data.check_out ? 'CheckedOut' : 'Present',
          checkInTime: data.data.check_in,
        });
      } else {
        setAttendanceStatus({ status: 'Absent', checkInTime: null });
      }
    } catch (error) {
      // It's okay if this fails, means no record for today
      setAttendanceStatus({ status: 'Absent', checkInTime: null });
    }
  };

  const fetchProfileAvatar = async () => {
    try {
      if (user?.id) {
        const { data } = await api.get(`/hr/profile/${user.id}`);
        if (data.data?.avatar) {
          setProfileAvatar(data.data.avatar);
        }
      }
    } catch (error) {
      // If fetching profile fails, just use default avatar
      console.error('Failed to fetch profile avatar:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodayStatus();
      fetchProfileAvatar();
    }
  }, [isAuthenticated, location.pathname, user?.id]);

  useEffect(() => {
    // Listen for profile avatar updates
    const handleAvatarUpdate = (event) => {
      if (event.detail?.avatar) {
        setProfileAvatar(event.detail.avatar);
      }
    };

    window.addEventListener('profileAvatarUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('profileAvatarUpdated', handleAvatarUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully! 👋');
    navigate('/');
  };

  const handleCheckIn = async () => {
    try {
      await api.post('/hr/attendance/checkin');
      toast.success('Checked in successfully!');
      fetchTodayStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed.');
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/hr/attendance/checkout');
      toast.success('Checked out successfully!');
      fetchTodayStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-out failed.');
    }
  };

  const renderAttendanceButton = () => {
    switch (attendanceStatus.status) {
      case 'Present':
        return (
          <button
            onClick={handleCheckOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
          >
            Check Out
          </button>
        );
      case 'Absent':
      case 'CheckedOut':
        return (
          <button
            onClick={handleCheckIn}
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600"
          >
            Check In
          </button>
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) return null;

  const serverBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 h-16 sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm">
      {/* Left Side - Logo and Company Name */}
      <div className="flex items-center gap-4">
        {user?.companyLogo && (
          <img
            src={`${serverBaseUrl}${user.companyLogo}`}
            alt="Company Logo"
            className="h-10 w-auto object-contain"
          />
        )}
        <Link to="/dashboard" className="font-bold text-xl text-gray-800 hover:text-[#00A09D] transition-colors">
          {user?.companyName || 'HRMS'}
        </Link>
        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')
                ? 'bg-[#00A09D] text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-[#00A09D]'
              }`}
          >
            <FaHome />
            Employees
          </Link>
          <Link
            to="/attendance"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/attendance')
                ? 'bg-[#00A09D] text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-[#00A09D]'
              }`}
          >
            <FaCalendarCheck />
            Attendance
          </Link>
          <Link
            to="/leave"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/leave')
                ? 'bg-[#00A09D] text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-[#00A09D]'
              }`}
          >
            <FaClipboardList />
            Time Off
          </Link>

        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${attendanceStatus.status === 'Present' ? 'bg-green-500' : 'bg-red-500'}`}
            title={attendanceStatus.status === 'Present' ? `Checked in since ${attendanceStatus.checkInTime}` : 'Checked Out'}
          ></div>
          {renderAttendanceButton()}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2"
          >
            {profileAvatar ? (
              <img
                src={`${serverBaseUrl}${profileAvatar}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <FaUserCircle size={28} className="text-gray-500" />
            )}
            <FaChevronDown className="text-xs text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Link
                to={`/profile/${user.id}`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setProfileOpen(false)}
              >
                <FaRegUser />
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaSignOutAlt />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

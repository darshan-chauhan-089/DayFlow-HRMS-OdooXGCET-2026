import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FaChevronDown, FaBell, FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully! 👋');
    navigate('/');
  };

  // Generate breadcrumbs based on path
  const getBreadcrumbs = () => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length === 0) return 'Dashboard';
    
    return path.map((segment, index) => {
      const isLast = index === path.length - 1;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
      return (
        <span key={segment} className="flex items-center">
          {index > 0 && <span className="mx-2 text-gray-400">/</span>}
          <span className={isLast ? 'font-semibold text-gray-800' : 'text-gray-500'}>
            {name}
          </span>
        </span>
      );
    });
  };

  if (!isAuthenticated) return null; // Don't show navbar on login/landing pages if not authenticated

  const serverBaseUrl = 'http://localhost:5000'; // Adjust if needed

  return (
    <nav className="bg-white border-b border-[#DEE2E6] h-16 sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Left: Company Info & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {user?.companyLogo && (
          <img 
            src={`${serverBaseUrl}${user.companyLogo}`} 
            alt="Company Logo" 
            className="h-10 w-auto object-contain"
          />
        )}
        {user?.companyName && (
          <span className="font-bold text-lg text-gray-700 hidden sm:block">
            {user.companyName}
          </span>
        )}
        
        <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>

        <div className="flex items-center text-sm">
          {getBreadcrumbs()}
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Search (Visual only for now) */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1.5">
          <FaSearch className="text-gray-400 text-xs" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-48 text-gray-600 placeholder-gray-400"
          />
        </div>

        {/* Notifications */}
        <button className="text-gray-500 hover:text-[#714B67] transition-colors relative">
          <FaBell />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 text-gray-700 hover:text-[#714B67] transition-colors"
          >
            <div className="h-8 w-8 bg-[#714B67] rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium hidden md:block">{user?.name || 'User'}</span>
            <FaChevronDown className="text-xs text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setProfileOpen(false)}
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

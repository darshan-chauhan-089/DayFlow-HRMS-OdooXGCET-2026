import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FaChevronDown, FaChevronRight, FaBell, FaSearch } from 'react-icons/fa';

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
    if (path.length === 0) return [{ name: 'Dashboard', isLast: true }];
    
    return path.map((segment, index) => {
      const isLast = index === path.length - 1;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      return { name, isLast };
    });
  };

  if (!isAuthenticated) return null;

  const serverBaseUrl = 'http://localhost:5000';
  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="bg-white border-b sticky-header h-16 px-6 flex items-center justify-between" style={{ borderColor: 'var(--border-color)', marginLeft: '260px' }}>
      {/* Left: Breadcrumbs */}
      <div className="flex items-center">
        <div className="odoo-breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <FaChevronRight className="text-xs" style={{ color: 'var(--text-muted)' }} />}
              <span 
                className="text-sm font-medium"
                style={{ color: crumb.isLast ? 'var(--text-main)' : 'var(--text-secondary)' }}
              >
                {crumb.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Search, Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Pill Search */}
        <div className="odoo-search">
          <FaSearch className="text-xs" style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-48"
          />
        </div>

        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-[#714B67] transition-colors">
          <FaBell className="text-lg" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Company Logo + Name (if available) */}
        {user?.companyLogo && (
          <div className="flex items-center gap-2 px-3 py-1.5 border-l" style={{ borderColor: 'var(--border-color)' }}>
            <img 
              src={`${serverBaseUrl}${user.companyLogo}`} 
              alt="Company Logo" 
              className="h-8 w-auto object-contain"
            />
            {user?.companyName && (
              <span className="text-sm font-semibold hidden lg:block" style={{ color: 'var(--text-main)' }}>
                {user.companyName}
              </span>
            )}
          </div>
        )}

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: 'var(--odoo-purple)' }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium hidden md:block" style={{ color: 'var(--text-main)' }}>
              {user?.name || 'User'}
            </span>
            <FaChevronDown className="text-xs" style={{ color: 'var(--text-muted)' }} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-md border py-2 z-50" style={{ borderColor: 'var(--border-color)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{user?.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                {user?.empId && (
                  <p className="text-xs mt-1 font-mono" style={{ color: 'var(--text-secondary)' }}>ID: {user.empId}</p>
                )}
              </div>
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                style={{ color: 'var(--text-main)' }}
                onClick={() => setProfileOpen(false)}
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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

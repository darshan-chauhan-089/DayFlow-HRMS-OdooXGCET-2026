import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FaRocket, FaChartBar, FaUser, FaHome, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully! 👋');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = isAuthenticated
    ? [
      { path: '/dashboard', label: 'Dashboard', icon: FaChartBar },
      { path: '/profile', label: 'Profile', icon: FaUser },
    ]
    : [
      { path: '/', label: 'Home', icon: FaHome },
    ];

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center mr-3 transform group-hover:rotate-12 transition-transform duration-300">
                <FaRocket className="text-2xl text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                MERN Stack
              </h1>
            </Link>
            {/* Desktop Navigation */}
            {isAuthenticated && (
              <div className="hidden md:ml-10 md:flex md:space-x-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${isActive(link.path)
                        ? 'bg-white bg-opacity-20 text-white'
                        : 'text-primary-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                      } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2`}
                  >
                    <link.icon className="text-base" />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white bg-opacity-10 px-4 py-2 rounded-lg">
                  <span className="text-primary-100 text-sm">👋</span>
                  <span className="text-white text-sm font-medium">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:bg-white hover:bg-opacity-10 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white border-opacity-30"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-primary-600 hover:bg-primary-50 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Sign Up →
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-800 border-t border-primary-500">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`${isActive(link.path)
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                  } block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2`}
              >
                <link.icon className="text-base" />
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-primary-200 text-sm">
                  Logged in as <span className="font-semibold">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-200 hover:bg-red-600 hover:text-white flex items-center gap-2"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-100 hover:bg-primary-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-white text-primary-600 hover:bg-primary-50"
                >
                  Sign Up →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

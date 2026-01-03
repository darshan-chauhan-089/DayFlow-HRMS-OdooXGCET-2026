import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaHome, FaUsers, FaCalendarCheck, FaClipboardList, FaMoneyBillWave, FaSignOutAlt, FaTh } from 'react-icons/fa';

const navBase = 'flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm';

const Sidebar = ({ role = 'Employee' }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`${navBase} ${isActive(to) ? 'bg-white/10 text-white border-l-4 border-[#00A09D]' : 'border-l-4 border-transparent'}`}
    >
      <Icon className="text-lg" />
      <span>{label}</span>
    </Link>
  );

  return (
    <aside className="w-64 bg-[#2C3E50] min-h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 bg-[#233140]">
        <div className="flex items-center gap-2">
          <FaTh className="text-[#00A09D] text-xl" />
          <h2 className="text-xl font-bold text-white tracking-tight">DayFlow</h2>
        </div>
      </div>

      {/* User Info (Mini) */}
      <div className="px-6 py-4 border-b border-gray-700">
        <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-1">
          {role === 'HR' || role === 'Admin' ? 'Administrator' : 'Employee'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1">
        <NavItem to="/dashboard" icon={FaHome} label="Dashboard" />
        <NavItem to="/profile" icon={FaUserCircle} label="My Profile" />
        <NavItem to="/attendance" icon={FaCalendarCheck} label="Attendance" />
        <NavItem to="/leave" icon={FaClipboardList} label="Time Off" />
        <NavItem to="/payroll" icon={FaMoneyBillWave} label="Payroll" />

        {(role === 'HR' || role === 'Admin') && (
          <>
            <div className="px-6 py-2 mt-4">
              <p className="text-xs uppercase text-gray-500 font-semibold">Administration</p>
            </div>
            <NavItem to="/employees" icon={FaUsers} label="Employees" />
            <NavItem to="/attendance-records" icon={FaCalendarCheck} label="Attendance Logs" />
            <NavItem to="/leave-approvals" icon={FaClipboardList} label="Approvals" />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

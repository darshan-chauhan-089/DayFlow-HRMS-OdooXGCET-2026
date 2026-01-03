import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaHome, FaUsers, FaCalendarCheck, FaClipboardList, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ role = 'Employee' }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`sidebar-nav-item ${isActive(to) ? 'active' : ''}`}
    >
      <Icon className="text-lg" />
      <span>{label}</span>
    </Link>
  );

  return (
    <aside style={{ width: '260px', backgroundColor: 'var(--sidebar-bg)' }} className="min-h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Brand */}
      <div className="h-16 flex items-center px-6" style={{ backgroundColor: '#253542' }}>
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="DayFlow" className="w-8 h-8 object-contain" />
          <h2 className="text-xl font-bold text-white">DayFlow</h2>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <p className="text-xs uppercase font-semibold tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {role === 'HR' || role === 'Admin' ? 'Administrator' : 'Employee'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <NavItem to="/dashboard" icon={FaHome} label="Dashboard" />
        <NavItem to="/profile" icon={FaUserCircle} label="My Profile" />
        <NavItem to="/attendance" icon={FaCalendarCheck} label="Attendance" />
        <NavItem to="/leave" icon={FaClipboardList} label="Time Off" />
        <NavItem to="/payroll" icon={FaMoneyBillWave} label="Payroll" />

        {(role === 'HR' || role === 'Admin') && (
          <>
            <div className="px-4 py-3 mt-4">
              <p className="text-xs uppercase font-semibold tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                Administration
              </p>
            </div>
            <NavItem to="/employees" icon={FaUsers} label="Employees" />
            <NavItem to="/attendance-records" icon={FaCalendarCheck} label="Attendance Logs" />
            <NavItem to="/leave-approvals" icon={FaClipboardList} label="Approvals" />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded transition-colors"
          style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import { useAuth } from '../context/AuthContext';
import { 
  FaUsers, 
  FaCalendarCheck, 
  FaClipboardList, 
  FaMoneyBillWave,
  FaChartLine,
  FaClock,
  FaBriefcase,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DashboardWidget = ({ title, value, subtext, icon: Icon, color, link }) => (
  <Link to={link} className="block group">
    <div className="odoo-card p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="odoo-label" style={{ color: 'var(--text-secondary)' }}>{title}</h3>
        <div className="p-2 rounded" style={{ backgroundColor: `${color}10` }}>
          <Icon className="text-lg" style={{ color }} />
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold" style={{ color: 'var(--text-main)' }}>{value}</span>
      </div>
      
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {subtext}
      </p>
      
      <div className="absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ backgroundColor: color }}></div>
    </div>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const role = (user?.role) || localStorage.getItem('userRole') || 'Employee';
  const isAdmin = role === 'Admin' || role === 'HR';

  // Mock employee data
  const employees = [
    { id: 'ODJODO20260001', name: 'John Doe', department: 'Engineering', status: 'Present', lastSeen: '09:00 AM' },
    { id: 'ODJODO20260002', name: 'Jane Smith', department: 'Marketing', status: 'Present', lastSeen: '08:45 AM' },
    { id: 'ODJODO20260003', name: 'Mike Johnson', department: 'Sales', status: 'On Leave', lastSeen: 'Nov 14' },
    { id: 'ODJODO20260004', name: 'Sarah Williams', department: 'HR', status: 'Present', lastSeen: '09:15 AM' },
    { id: 'ODJODO20260005', name: 'Tom Brown', department: 'Engineering', status: 'Remote', lastSeen: '08:30 AM' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Overview of your activities and pending tasks</p>
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin ? (
          <>
            <DashboardWidget 
              title="Total Employees" 
              value="124" 
              subtext="+3 new this month" 
              icon={FaUsers} 
              color="#714B67" 
              link="/profile"
            />
            <DashboardWidget 
              title="Attendance Today" 
              value="118" 
              subtext="95% present" 
              icon={FaCalendarCheck} 
              color="#00A09D" 
              link="/attendance"
            />
            <DashboardWidget 
              title="Leave Requests" 
              value="9" 
              subtext="Pending approval" 
              icon={FaClipboardList} 
              color="#F59E0B" 
              link="/leave"
            />
            <DashboardWidget 
              title="Payroll Processed" 
              value="$45k" 
              subtext="For November 2026" 
              icon={FaMoneyBillWave} 
              color="#8B5CF6" 
              link="/payroll"
            />
          </>
        ) : (
          <>
            <DashboardWidget 
              title="My Attendance" 
              value="Present" 
              subtext="Checked in at 09:00 AM" 
              icon={FaClock} 
              color="#00A09D" 
              link="/attendance"
            />
            <DashboardWidget 
              title="Leave Balance" 
              value="12 Days" 
              subtext="Available paid leave" 
              icon={FaBriefcase} 
              color="#714B67" 
              link="/leave"
            />
            <DashboardWidget 
              title="Pending Tasks" 
              value="5" 
              subtext="Due this week" 
              icon={FaClipboardList} 
              color="#F59E0B" 
              link="/dashboard"
            />
            <DashboardWidget 
              title="Next Holiday" 
              value="Dec 25" 
              subtext="Christmas Day" 
              icon={FaCalendarCheck} 
              color="#8B5CF6" 
              link="/dashboard"
            />
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Table (Admin view) */}
        {isAdmin && (
          <div className="lg:col-span-2 odoo-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>Recent Employees</h3>
              <div className="flex gap-2">
                <button className="odoo-btn-secondary text-xs px-3 py-1.5 flex items-center gap-2">
                  <FaFilter className="text-xs" />
                  Filter
                </button>
              </div>
            </div>

            {/* Odoo-Style Table */}
            <div className="overflow-auto">
              <table className="odoo-table">
                <thead>
                  <tr>
                    <th>Login ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{emp.id}</td>
                      <td className="font-semibold" style={{ color: 'var(--text-main)' }}>{emp.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{emp.department}</td>
                      <td>
                        <span 
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{ 
                            backgroundColor: emp.status === 'Present' ? '#D1FAE5' : emp.status === 'Remote' ? '#DBEAFE' : '#FEE2E2',
                            color: emp.status === 'Present' ? '#065F46' : emp.status === 'Remote' ? '#1E40AF' : '#991B1B'
                          }}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="text-sm" style={{ color: 'var(--text-muted)' }}>{emp.lastSeen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Chart Area (Employee view) */}
        {!isAdmin && (
          <div className="lg:col-span-2 odoo-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                <FaChartLine style={{ color: 'var(--odoo-purple)' }} /> 
                My Performance
              </h3>
              <select className="odoo-input text-xs py-2 w-auto">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
            
            {/* Mock Chart */}
            <div className="h-64 flex items-end justify-between gap-1 px-4">
              {[65, 40, 75, 55, 80, 60, 90, 70, 85, 50, 65, 75].map((h, i) => (
                <div key={i} className="w-full bg-gray-100 rounded-t-sm relative group" style={{ borderRadius: 'var(--radius-sm)' }}>
                  <div 
                    className="absolute bottom-0 left-0 w-full opacity-90 rounded-t-sm transition-all duration-500 group-hover:opacity-100"
                    style={{ height: `${h}%`, backgroundColor: 'var(--odoo-purple)', borderRadius: 'var(--radius-sm)' }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="odoo-card p-6">
          <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-main)' }}>Recent Activity</h3>
          <div className="space-y-5">
            {[
              { title: 'Leave Approved', time: '2 hours ago', type: 'success', desc: 'Your leave for Nov 15 was approved.' },
              { title: 'New Policy Update', time: 'Yesterday', type: 'info', desc: 'HR updated the remote work policy.' },
              { title: 'Meeting Reminder', time: 'Tomorrow, 10:00 AM', type: 'warning', desc: 'Team sync with Product Design.' },
              { title: 'Payroll Generated', time: '3 days ago', type: 'success', desc: 'Payslip for November is available.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0`} style={{
                  backgroundColor: item.type === 'success' ? '#00A09D' : item.type === 'warning' ? '#F59E0B' : '#714B67'
                }}></div>
                <div>
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{item.title}</h4>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                  <span className="text-xs mt-1 block" style={{ color: 'var(--text-muted)' }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-sm font-semibold hover:underline" style={{ color: 'var(--odoo-purple)' }}>
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

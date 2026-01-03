import { useAuth } from '../context/AuthContext';
import { 
  FaUsers, 
  FaCalendarCheck, 
  FaClipboardList, 
  FaMoneyBillWave,
  FaChartLine,
  FaClock,
  FaBriefcase
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DashboardWidget = ({ title, value, subtext, icon: Icon, color, link }) => (
  <Link to={link} className="block group">
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 h-full relative overflow-hidden">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${color}-600`}>
        <Icon size={64} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">{title}</h3>
          <div className={`p-2 rounded-full bg-${color}-50 text-${color}-600`}>
            <Icon size={16} />
          </div>
        </div>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-800">{value}</span>
        </div>
        
        <p className="text-sm text-gray-500 flex items-center gap-1">
          {subtext}
        </p>
      </div>
      
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-${color}-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
    </div>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const role = (user?.role) || localStorage.getItem('userRole') || 'Employee';
  const isAdmin = role === 'Admin' || role === 'HR';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your activities and pending tasks.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <DashboardWidget 
              title="Total Employees" 
              value="124" 
              subtext="+3 new this month" 
              icon={FaUsers} 
              color="blue" 
              link="/profile"
            />
            <DashboardWidget 
              title="Attendance Today" 
              value="118" 
              subtext="95% present" 
              icon={FaCalendarCheck} 
              color="green" 
              link="/attendance"
            />
            <DashboardWidget 
              title="Leave Requests" 
              value="9" 
              subtext="Pending approval" 
              icon={FaClipboardList} 
              color="orange" 
              link="/leave"
            />
            <DashboardWidget 
              title="Payroll Processed" 
              value="$45k" 
              subtext="For October 2023" 
              icon={FaMoneyBillWave} 
              color="purple" 
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
              color="green" 
              link="/attendance"
            />
            <DashboardWidget 
              title="Leave Balance" 
              value="12 Days" 
              subtext="Available paid leave" 
              icon={FaBriefcase} 
              color="blue" 
              link="/leave"
            />
            <DashboardWidget 
              title="Pending Tasks" 
              value="5" 
              subtext="Due this week" 
              icon={FaClipboardList} 
              color="orange" 
              link="/dashboard"
            />
            <DashboardWidget 
              title="Next Holiday" 
              value="Dec 25" 
              subtext="Christmas Day" 
              icon={FaCalendarCheck} 
              color="purple" 
              link="/dashboard"
            />
          </>
        )}
      </div>

      {/* Charts / Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FaChartLine className="text-[#714B67]" /> 
              {isAdmin ? 'Attendance Trends' : 'My Performance'}
            </h3>
            <select className="text-sm border-gray-300 rounded-md text-gray-500 focus:ring-[#714B67] focus:border-[#714B67]">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          {/* Mock Chart Placeholder */}
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[65, 40, 75, 55, 80, 60, 90, 70, 85, 50, 65, 75].map((h, i) => (
              <div key={i} className="w-full bg-gray-100 rounded-t-sm relative group">
                <div 
                  className="absolute bottom-0 left-0 w-full bg-[#714B67] opacity-80 rounded-t-sm transition-all duration-500 group-hover:opacity-100"
                  style={{ height: `${h}%` }}
                ></div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 uppercase tracking-wide">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        {/* Recent Activity / Notifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { title: 'Leave Approved', time: '2 hours ago', type: 'success', desc: 'Your leave for Nov 15 was approved.' },
              { title: 'New Policy Update', time: 'Yesterday', type: 'info', desc: 'HR updated the remote work policy.' },
              { title: 'Meeting Reminder', time: 'Tomorrow, 10:00 AM', type: 'warning', desc: 'Team sync with Product Design.' },
              { title: 'Payroll Generated', time: '3 days ago', type: 'success', desc: 'Payslip for October is available.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                  item.type === 'success' ? 'bg-green-500' : 
                  item.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  <span className="text-xs text-gray-400 mt-1 block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-sm text-[#714B67] font-medium hover:text-[#5d3d54]">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

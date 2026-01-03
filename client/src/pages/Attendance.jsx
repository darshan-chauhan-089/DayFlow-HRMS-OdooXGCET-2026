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
  FaPlus
} from 'react-icons/fa';

const STORAGE_KEY = 'attendance_records';

const getTodayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const Attendance = () => {
  const [records, setRecords] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  });
  const todayKey = getTodayKey();
  const todayRecord = records[todayKey] || null;
  const [now, setNow] = useState(Date.now());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const saveRecords = (next) => {
    setRecords(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleCheckIn = () => {
    if (todayRecord?.checkIn) {
      toast.error('Already checked in');
      return;
    }
    const next = { ...records, [todayKey]: { checkIn: Date.now(), checkOut: null, status: 'Present' } };
    saveRecords(next);
    toast.success('Checked in successfully');
  };

  const computeStatus = (start, end) => {
    if (!start || !end) return 'Present';
    const hours = (end - start) / (1000 * 60 * 60);
    if (hours >= 7.5) return 'Present';
    if (hours >= 3.5) return 'Half-day';
    return 'Absent';
  };

  const handleCheckOut = () => {
    if (!todayRecord?.checkIn) {
      toast.error('You need to check in first');
      return;
    }
    if (todayRecord?.checkOut) {
      toast.error('Already checked out');
      return;
    }
    const end = Date.now();
    const status = computeStatus(todayRecord.checkIn, end);
    const next = { ...records, [todayKey]: { ...todayRecord, checkOut: end, status } };
    saveRecords(next);
    toast.success('Checked out successfully');
  };

  const weeklyRows = useMemo(() => {
    const days = 30; // Show last 30 days
    const res = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const r = records[key];
      
      // Skip future dates if no record
      if (d > new Date() && !r) continue;

      res.push({
        id: key,
        date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
        checkIn: r?.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
        checkOut: r?.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
        workHours: r?.checkIn && r?.checkOut 
          ? ((r.checkOut - r.checkIn) / (1000 * 60 * 60)).toFixed(2) + ' hrs' 
          : '-',
        status: r?.status || 'Absent',
      });
    }
    return res.filter(row => 
      row.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  const duration = todayRecord?.checkIn && !todayRecord?.checkOut 
    ? Math.max(0, now - todayRecord.checkIn) 
    : 0;
  const durationStr = new Date(duration).toISOString().substring(11, 19);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Present': return 'bg-green-100 text-green-800 border border-green-200';
      case 'Half-day': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'Absent': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="odoo-btn-primary flex items-center gap-2">
            <FaPlus size={12} /> Create
          </button>
          <button className="odoo-btn-secondary flex items-center gap-2">
            <FaDownload size={12} /> Export
          </button>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search attendance..." 
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

          <div className="flex gap-3">
            {!todayRecord?.checkIn ? (
              <button 
                onClick={handleCheckIn} 
                className="px-6 py-2.5 bg-[#00A09D] hover:bg-[#008a87] text-white rounded-md font-medium shadow-sm transition-colors flex items-center gap-2"
              >
                <FaSignInAlt /> Check In
              </button>
            ) : !todayRecord?.checkOut ? (
              <button 
                onClick={handleCheckOut} 
                className="px-6 py-2.5 bg-[#714B67] hover:bg-[#5d3d54] text-white rounded-md font-medium shadow-sm transition-colors flex items-center gap-2"
              >
                <FaSignOutAlt /> Check Out
              </button>
            ) : (
              <span className="px-6 py-2.5 bg-green-100 text-green-700 rounded-md font-medium border border-green-200 flex items-center gap-2">
                <FaCalendarCheck /> Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="odoo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                <th className="p-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-[#714B67] focus:ring-[#714B67]" />
                </th>
                <th className="p-4">Date</th>
                <th className="p-4">Check In</th>
                <th className="p-4">Check Out</th>
                <th className="p-4">Work Hours</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {weeklyRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-gray-300 text-[#714B67] focus:ring-[#714B67]" />
                  </td>
                  <td className="p-4 font-medium">{row.date}</td>
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
              {weeklyRows.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Mock) */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
          <span>Showing 1 to {weeklyRows.length} of {weeklyRows.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;

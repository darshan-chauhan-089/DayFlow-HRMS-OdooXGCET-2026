import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlane, FaUserCircle, FaSearch, FaUsers } from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AddEmployee from './AddEmployee';

const StatusIndicator = ({ status }) => {
  switch (status) {
    case 'Present':
      return <div className="w-3 h-3 rounded-full bg-green-500" title="Present"></div>;
    case 'On Leave':
      return <FaPlane className="text-blue-500" title="On Leave" />;
    case 'Absent':
      return <div className="w-3 h-3 rounded-full bg-yellow-500" title="Absent"></div>;
    default:
      return <div className="w-3 h-3 rounded-full bg-gray-400" title="Unknown"></div>;
  }
};

const EmployeeCard = ({ employee, onClick }) => {
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    return `http://localhost:5000${avatarPath}`;
  };

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onClick(employee.id)}
    >
      <div className="flex justify-between items-start">
        {employee.avatar ? (
          <img src={getAvatarUrl(employee.avatar)} alt={employee.name} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <FaUserCircle size={64} className="text-gray-400" />
        )}
        <StatusIndicator status={employee.attendance_status} />
      </div>
      <div className="mt-4">
        <h3 className="font-bold text-gray-800">{employee.name}</h3>
        <p className="text-sm text-gray-500">{employee.job_title || 'Employee'}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  const role = (user?.role) || localStorage.getItem('userRole') || 'Employee';
  const isAdminOrHR = role === 'Admin' || role === 'HR';

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await api.get('/hr/employees');
        setEmployees(res.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch employees');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleCardClick = (employeeId) => {
    navigate(`/profile/${employeeId}`);
  };

  const handleEmployeeAdded = (newEmployee) => {
    setEmployees([newEmployee, ...employees]);
  };

  const filteredEmployees = employees.filter(emp =>
    (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 group-focus-within:text-[#00A09D] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A09D]/20 focus:border-[#00A09D] w-64 transition-all duration-200 bg-gray-50 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdminOrHR && (
            <button
              onClick={() => setShowAddEmployee(true)}
              className="bg-[#00A09D] text-white px-6 py-2.5 rounded-xl hover:bg-[#008c8a] transition-all shadow-sm hover:shadow-md font-medium flex items-center gap-2"
            >
              <span>+</span> NEW
            </button>
          )}
        </div>
      </div>

      {loading && <p>Loading employees...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredEmployees.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredEmployees.map(employee => (
            <EmployeeCard key={employee.id} employee={employee} onClick={handleCardClick} />
          ))}
        </div>
      )}

      {!loading && !error && filteredEmployees.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-gray-50 p-6 rounded-full mb-4">
            <FaUsers size={48} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No employees found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {searchTerm
              ? `We couldn't find any employees matching "${searchTerm}". Try a different search term.`
              : "There are no employees in the database yet. Click the 'NEW' button to add your first employee."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-6 text-[#00A09D] font-medium hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <AddEmployee
          onClose={() => setShowAddEmployee(false)}
          onEmployeeAdded={handleEmployeeAdded}
        />
      )}
    </div>
  );
};

export default Dashboard;

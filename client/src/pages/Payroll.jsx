import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaSave, FaMoneyBillWave } from 'react-icons/fa';

const Payroll = () => {
  const { user } = useAuth();
  // Mock isAdmin check - in real app use user.role
  const isAdmin = user?.role === 'Admin' || user?.role === 'HR'; 
  const [isEditing, setIsEditing] = useState(false);

  // Mock Salary Structure Data
  const [salaryStructure, setSalaryStructure] = useState([
    { id: 1, component: 'Basic Salary', amount: 50000, type: 'Earnings' },
    { id: 2, component: 'House Rent Allowance (HRA)', amount: 20000, type: 'Earnings' },
    { id: 3, component: 'Special Allowance', amount: 15000, type: 'Earnings' },
    { id: 4, component: 'Provident Fund (PF)', amount: 3600, type: 'Deductions' },
    { id: 5, component: 'Professional Tax', amount: 200, type: 'Deductions' },
  ]);

  const handleAmountChange = (id, newAmount) => {
    setSalaryStructure(salaryStructure.map(item => 
      item.id === id ? { ...item, amount: Number(newAmount) } : item
    ));
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Save logic would go here
      console.log('Saving salary structure:', salaryStructure);
    }
    setIsEditing(!isEditing);
  };

  const totalEarnings = salaryStructure
    .filter(item => item.type === 'Earnings')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDeductions = salaryStructure
    .filter(item => item.type === 'Deductions')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netSalary = totalEarnings - totalDeductions;

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaMoneyBillWave className="text-green-600" />
            Payroll & Salary Structure
          </h1>
          {/* Admin Toggle for Edit Mode */}
          <button
            onClick={toggleEdit}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isEditing 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isEditing ? <><FaSave /> Save Changes</> : <><FaEdit /> Edit Structure (Admin)</>}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Net Salary</p>
                <h2 className="text-4xl font-bold text-gray-800 mt-1">₹{netSalary.toLocaleString()}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Gross Earnings: <span className="font-medium text-green-600">₹{totalEarnings.toLocaleString()}</span></p>
                <p className="text-sm text-gray-500">Total Deductions: <span className="font-medium text-red-600">-₹{totalDeductions.toLocaleString()}</span></p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Earnings</h3>
            <div className="space-y-3 mb-6">
              {salaryStructure.filter(item => item.type === 'Earnings').map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2">
                  <span className="text-gray-600 font-medium">{item.component}</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleAmountChange(item.id, e.target.value)}
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <span className="text-gray-800 font-semibold">₹{item.amount.toLocaleString()}</span>
                  )}
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Deductions</h3>
            <div className="space-y-3">
              {salaryStructure.filter(item => item.type === 'Deductions').map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2">
                  <span className="text-gray-600 font-medium">{item.component}</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleAmountChange(item.id, e.target.value)}
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  ) : (
                    <span className="text-red-600 font-semibold">-₹{item.amount.toLocaleString()}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payroll;

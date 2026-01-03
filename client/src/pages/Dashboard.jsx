import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats] = useState({
    projects: 12,
    tasks: 48,
    completed: 36,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-gradient-to-b from-primary-600 to-primary-800 shadow-2xl min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            </div>
          </div>
          <nav className="mt-6">
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3 text-white bg-white bg-opacity-20 border-l-4 border-white font-medium backdrop-blur-sm"
            >
              <span>🏠</span>
              <span>Overview</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3 text-primary-100 hover:bg-white hover:bg-opacity-10 hover:text-white transition-all duration-200"
            >
              <span>📁</span>
              <span>Projects</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3 text-primary-100 hover:bg-white hover:bg-opacity-10 hover:text-white transition-all duration-200"
            >
              <span>✅</span>
              <span>Tasks</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3 text-primary-100 hover:bg-white hover:bg-opacity-10 hover:text-white transition-all duration-200"
            >
              <span>📊</span>
              <span>Analytics</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3 text-primary-100 hover:bg-white hover:bg-opacity-10 hover:text-white transition-all duration-200"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 bg-gradient-to-r from-primary-600 to-purple-600 p-8 rounded-2xl shadow-2xl text-white">
              <h1 className="text-4xl font-bold">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-primary-100 mt-3 text-lg">
                Here's what's happening with your projects today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Projects</p>
                    <p className="text-5xl font-bold mt-3">
                      {stats.projects}
                    </p>
                    <p className="text-blue-200 text-sm mt-2">↑ 12% from last month</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                    <span className="text-4xl">📁</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-8 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Active Tasks</p>
                    <p className="text-5xl font-bold mt-3">
                      {stats.tasks}
                    </p>
                    <p className="text-purple-200 text-sm mt-2">↑ 8% from last week</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <svg
                      className="w-8 h-8 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.completed}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center py-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">
                      New project created
                    </p>
                    <p className="text-gray-500 text-sm">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center py-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Task completed</p>
                    <p className="text-gray-500 text-sm">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center py-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">
                      Team member added
                    </p>
                    <p className="text-gray-500 text-sm">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

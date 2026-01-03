import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setProfileData(response.data.user);
    } catch (err) {
      const errorMsg = 'Failed to fetch profile data';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 px-8 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="relative flex items-center">
              <div className="h-28 w-28 rounded-full bg-white flex items-center justify-center text-primary-600 text-5xl font-bold shadow-2xl ring-4 ring-white ring-opacity-50 transform hover:scale-110 transition-transform duration-300">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-8">
                <h1 className="text-4xl font-bold text-white mb-2">{user?.name}</h1>
                <p className="text-purple-100 text-lg flex items-center gap-2">
                  <span>📧</span>
                  {user?.email}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-white text-sm font-medium">Active Member</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-8 py-10">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>📝</span>
                  Profile Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>👤</span>
                      Full Name
                    </label>
                    <p className="px-5 py-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl text-gray-900 font-medium border-l-4 border-primary-500">
                      {profileData?.name || user?.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>📧</span>
                      Email Address
                    </label>
                    <p className="px-5 py-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl text-gray-900 font-medium border-l-4 border-purple-500">
                      {profileData?.email || user?.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>📅</span>
                      Member Since
                    </label>
                    <p className="px-5 py-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl text-gray-900 font-medium border-l-4 border-pink-500">
                      {profileData?.createdAt
                        ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>✅</span>
                      Account Status
                    </label>
                    <p className="px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl text-green-700 font-bold border-l-4 border-green-500 flex items-center gap-2">
                      <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                      Active
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Account Statistics
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-sm text-primary-600 font-medium">
                      Total Projects
                    </p>
                    <p className="text-2xl font-bold text-primary-700 mt-2">
                      12
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">
                      Completed Tasks
                    </p>
                    <p className="text-2xl font-bold text-green-700 mt-2">
                      36
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600 font-medium">
                      Active Tasks
                    </p>
                    <p className="text-2xl font-bold text-yellow-700 mt-2">
                      12
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

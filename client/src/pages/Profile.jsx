import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { FaBriefcase, FaMoneyBillWave, FaFileAlt, FaPhoneAlt, FaMapMarkerAlt, FaUserCircle, FaSave, FaUpload } from 'react-icons/fa';

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

              {/* Read-only: Job Details, Salary Structure, Documents */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><FaBriefcase /> Job Details</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li><span className="font-semibold">Designation:</span> {profileData?.designation || 'Software Engineer'}</li>
                    <li><span className="font-semibold">Department:</span> {profileData?.department || 'IT'}</li>
                    <li><span className="font-semibold">Employee ID:</span> {profileData?.employeeId || user?.employeeId || 'EMP-12345'}</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><FaMoneyBillWave /> Salary Structure</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li><span className="font-semibold">Basic:</span> ₹ {profileData?.salaryBasic || '50,000'}</li>
                    <li><span className="font-semibold">HRA:</span> ₹ {profileData?.salaryHra || '20,000'}</li>
                    <li><span className="font-semibold">Allowances:</span> ₹ {profileData?.salaryAllow || '10,000'}</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><FaFileAlt /> Documents</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>Resume.pdf — <span className="text-green-600 font-medium">Verified</span></li>
                    <li>OfferLetter.pdf — <span className="text-green-600 font-medium">Verified</span></li>
                    <li>ID Proof — <span className="text-green-600 font-medium">Verified</span></li>
                  </ul>
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

              {/* Editable fields */}
              <EditableSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditableSection = () => {
  const [address, setAddress] = useState(localStorage.getItem('profile_address') || '');
  const [phone, setPhone] = useState(localStorage.getItem('profile_phone') || '');
  const [photoPreview, setPhotoPreview] = useState(localStorage.getItem('profile_photo') || '');

  const handleSave = () => {
    localStorage.setItem('profile_address', address);
    localStorage.setItem('profile_phone', phone);
    if (photoPreview) localStorage.setItem('profile_photo', photoPreview);
    toast.success('Profile updated');
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FaUserCircle /> Edit Profile</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaMapMarkerAlt /> Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your address"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaPhoneAlt /> Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g., +91 98765 43210"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaUpload /> Profile Picture</label>
        <div className="flex items-center gap-4">
          {photoPreview ? (
            <img src={photoPreview} alt="profile" className="w-20 h-20 rounded-full object-cover border" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-100 border flex items-center justify-center text-gray-400">N/A</div>
          )}
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>
      </div>

      <div className="mt-6">
        <button onClick={handleSave} className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
          <FaSave /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;

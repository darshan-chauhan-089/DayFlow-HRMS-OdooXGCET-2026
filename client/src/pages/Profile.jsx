import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaUserCircle, FaEdit, FaPlus, FaSave } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();
  const { id: profileId } = useParams();
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('resume');
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const isOwnProfile = !profileId || user?.id == profileId;
  
  // Role-based permissions
  const isAdminOrHR = user?.role === 'HR' || user?.role === 'Admin';
  const canEditResume = isAdminOrHR;
  const canEditPrivate = isAdminOrHR || isOwnProfile;
  const canEditSalary = isAdminOrHR;
  const canEditSecurity = isOwnProfile;
  const canEditAvatar = isAdminOrHR || isOwnProfile;

  useEffect(() => {
    const fetchProfile = async () => {
      const idToFetch = profileId || user?.id;
      if (!idToFetch) {
        setError('No profile ID specified.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await api.get(`/hr/profile/${idToFetch}`);
        
        // Map snake_case from DB to camelCase for frontend state
        const mappedData = {
          ...data.data,
          jobTitle: data.data.job_title || data.data.jobTitle,
          salaryBase: data.data.salary_base || data.data.salaryBase,
          dateOfBirth: data.data.date_of_birth || data.data.dateOfBirth,
          joiningDate: data.data.joining_date || data.data.joiningDate,
          personalEmail: data.data.personal_email || data.data.personalEmail,
          maritalStatus: data.data.marital_status || data.data.maritalStatus,
          bankAccountNo: data.data.bank_account_no || data.data.bankAccountNo,
          bankName: data.data.bank_name || data.data.bankName,
          ifscCode: data.data.ifsc_code || data.data.ifscCode,
          panNo: data.data.pan_no || data.data.panNo,
          uanNo: data.data.uan_no || data.data.uanNo,
        };
        
        setProfileData(mappedData);
        setSkills(data.data.skills || []);
        setCertifications(data.data.certifications || []);
        setError('');
      } catch (err) {
        setError('Failed to fetch profile data.');
        toast.error('Failed to fetch profile data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleImageClick = () => {
    if (canEditAvatar) {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const idToUpdate = profileId || user?.id;
      const { data } = await api.put(`/hr/profile/${idToUpdate}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfileData({ ...profileData, avatar: data.data.avatar });
      toast.success('Profile picture updated!');
      
      window.dispatchEvent(new CustomEvent('profileAvatarUpdated', { 
        detail: { avatar: data.data.avatar } 
      }));
    } catch (error) {
      toast.error('Failed to upload image.');
    }
  };

  const saveProfile = async () => {
    const idToUpdate = profileId || user?.id;
    try {
      const payload = {
        ...profileData,
        skills,
        certifications
      };

      const { data } = await api.put(`/hr/profile/${idToUpdate}`, payload);
      setProfileData(data.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    // Implement password update API call here
    toast.success("Password update functionality to be implemented");
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification('');
    }
  };

  if (loading) return <div className="p-8">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!profileData) return <div className="p-8">Profile not found.</div>;

  const serverBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header Section */}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
          
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Picture */}
            <div className="relative group mx-auto md:mx-0">
              <div 
                onClick={handleImageClick}
                className={`w-32 h-32 rounded-full bg-pink-200 flex items-center justify-center overflow-hidden ${canEditAvatar ? 'cursor-pointer' : ''}`}
              >
                {profileData.avatar ? (
                  <img 
                    src={`${serverBaseUrl}${profileData.avatar}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={128} className="text-pink-300" />
                )}
                {canEditAvatar && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <FaEdit className="text-white text-2xl" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
                  <p className="text-gray-600 font-medium mt-1">{profileData.jobTitle || profileData.job_title || 'Job Position'}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">Email: {profileData.email}</p>
                    <p className="text-sm text-gray-500">Mobile: {profileData.phone || 'Not set'}</p>
                  </div>
                </div>
                
                {/* Company Info Card */}
                <div className="bg-gray-50 rounded-lg p-4 min-w-[250px] w-full md:w-auto">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Company</span>
                      <span className="text-sm font-medium text-gray-800">{user?.companyName || 'DayFlow'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Department</span>
                      <span className="text-sm font-medium text-gray-800">{profileData.department || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Manager</span>
                      <span className="text-sm font-medium text-gray-800">N/A</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Location</span>
                      <span className="text-sm font-medium text-gray-800">{profileData.address ? profileData.address.substring(0, 20) + '...' : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {['resume', 'private', 'salary', 'security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-[#00A09D] text-[#00A09D]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'private' ? 'Private Info' : tab === 'salary' ? 'Salary Info' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'resume' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">About</h3>
                  </div>
                  {canEditResume ? (
                    <textarea
                      name="about"
                      value={profileData.about || ''}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {profileData.about || 'No information provided.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Skills</h3>
                  <div className="space-y-2 mb-3">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                  {canEditResume && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add new skill"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <button onClick={addSkill} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm flex items-center gap-1">
                        <FaPlus size={12} /> Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {canEditResume && (
                <div className="col-span-1 lg:col-span-2 flex justify-end">
                  <button onClick={saveProfile} className="px-6 py-2 bg-[#00A09D] text-white rounded-md hover:bg-[#008f8c] flex items-center gap-2">
                    <FaSave /> Save Resume
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'private' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Details</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : ''}
                        onChange={handleInputChange}
                        disabled={!canEditPrivate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Residing Address</label>
                      <textarea
                        name="address"
                        value={profileData.address || ''}
                        onChange={handleInputChange}
                        disabled={!canEditPrivate}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                      <input
                        type="text"
                        name="nationality"
                        value={profileData.nationality || ''}
                        onChange={handleInputChange}
                        disabled={!canEditPrivate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Personal Email</label>
                      <input
                        type="email"
                        name="personalEmail"
                        value={profileData.personalEmail || ''}
                        onChange={handleInputChange}
                        disabled={!canEditPrivate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          name="gender"
                          value={profileData.gender || ''}
                          onChange={handleInputChange}
                          disabled={!canEditPrivate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                        <select
                          name="maritalStatus"
                          value={profileData.maritalStatus || ''}
                          onChange={handleInputChange}
                          disabled={!canEditPrivate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                        >
                          <option value="">Select</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                      <input
                        type="date"
                        name="joiningDate"
                        value={profileData.joiningDate ? profileData.joiningDate.split('T')[0] : ''}
                        onChange={handleInputChange}
                        disabled={!canEditPrivate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Bank Details</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        name="bankAccountNo"
                        value={profileData.bankAccountNo || ''}
                        onChange={handleInputChange}
                        disabled={!canEditPrivate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <input
                        type="text"
                        name="bankName"
                        value={profileData.bankName || ''}
                        onChange={handleInputChange}
                        disabled={!canEditPrivate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        name="ifscCode"
                        value={profileData.ifscCode || ''}
                        onChange={handleInputChange}
                        disabled={!canEditPrivate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PAN No</label>
                      <input
                        type="text"
                        name="panNo"
                        value={profileData.panNo || ''}
                        onChange={handleInputChange}
                        disabled={!canEditPrivate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">UAN NO</label>
                      <input
                        type="text"
                        name="uanNo"
                        value={profileData.uanNo || ''}
                        onChange={handleInputChange}
                        disabled={!canEditPrivate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emp Code</label>
                      <input
                        type="text"
                        value={profileData.emp_id || ''}
                        disabled={true}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {canEditPrivate && (
                <div className="flex justify-end pt-4">
                  <button onClick={saveProfile} className="px-6 py-2 bg-[#00A09D] text-white rounded-md hover:bg-[#008f8c] flex items-center gap-2">
                    <FaSave /> Save Private Info
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="max-w-2xl space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Salary & Job Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary</label>
                  <input
                    type="number"
                    name="salaryBase"
                    value={profileData.salaryBase || ''}
                    onChange={handleInputChange}
                    disabled={!canEditSalary}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={profileData.jobTitle || ''}
                    onChange={handleInputChange}
                    disabled={!canEditSalary}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={profileData.department || ''}
                    onChange={handleInputChange}
                    disabled={!canEditSalary}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                  />
                </div>
              </div>
              {canEditSalary && (
                <div className="flex justify-end pt-4">
                  <button onClick={saveProfile} className="px-6 py-2 bg-[#00A09D] text-white rounded-md hover:bg-[#008f8c] flex items-center gap-2">
                    <FaSave /> Save Salary Info
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-md space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    disabled={!canEditSecurity}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    disabled={!canEditSecurity}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    disabled={!canEditSecurity}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              {canEditSecurity && (
                <div className="flex justify-end pt-4">
                  <button onClick={updatePassword} className="px-6 py-2 bg-[#00A09D] text-white rounded-md hover:bg-[#008f8c] flex items-center gap-2">
                    <FaSave /> Update Password
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

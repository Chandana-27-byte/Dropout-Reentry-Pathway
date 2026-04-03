import React, { useState } from 'react';
import { FiUser, FiLock, FiSave, FiCamera } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || user?.firstName || '',
    lastName: user?.last_name || user?.lastName || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) { updateUser(profileData); toast.success('Profile updated successfully'); }
    } catch (error) { toast.error('Failed to update profile'); } finally { setLoading(false); }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    try {
      const response = await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (response.success) { toast.success('Password changed successfully'); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to change password'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div><h1 className="page-title">Profile Settings</h1><p className="page-subtitle">Manage your account information</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card padding={false}>
            <div className="p-6 text-center border-b border-gray-100">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary-700 font-bold text-3xl">{profileData.firstName?.[0]}{profileData.lastName?.[0]}</span>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50"><FiCamera className="w-4 h-4 text-gray-600" /></button>
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{profileData.firstName} {profileData.lastName}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="badge badge-info mt-2 capitalize">{user?.role}</span>
            </div>
            <nav className="p-2">
              {[{ id: 'profile', icon: FiUser, label: 'Profile Information' }, { id: 'password', icon: FiLock, label: 'Change Password' }].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-600'}`}>
                  <tab.icon className="w-5 h-5" />{tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card title="Profile Information" subtitle="Update your personal details">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" name="firstName" value={profileData.firstName} onChange={handleProfileChange} required />
                  <Input label="Last Name" name="lastName" value={profileData.lastName} onChange={handleProfileChange} required />
                </div>
                <Input label="Email Address" type="email" value={user?.email} disabled helper="Email cannot be changed" />
                <Input label="Phone Number" type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} />
                <div className="flex justify-end"><Button type="submit" icon={FiSave} loading={loading}>Save Changes</Button></div>
              </form>
            </Card>
          )}
          {activeTab === 'password' && (
            <Card title="Change Password" subtitle="Ensure your account is secure">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <Input label="Current Password" type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} error={errors.currentPassword} required />
                <Input label="New Password" type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} error={errors.newPassword} helper="Minimum 8 characters" required />
                <Input label="Confirm New Password" type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} error={errors.confirmPassword} required />
                <div className="flex justify-end"><Button type="submit" icon={FiLock} loading={loading}>Change Password</Button></div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

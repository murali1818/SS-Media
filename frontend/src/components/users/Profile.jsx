import React, { useState, useEffect } from 'react';
import fetchProfile from '../../funtions/fetchProfile';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchProfile();
        setUser(user);
        setUpdatedName(user.name);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/profile', { name: updatedName }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Profile updated successfully');
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Internal server error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      await axios.post('http://localhost:5000/changepassword', {
        oldpassword: currentPassword,
        password: newPassword,
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message || 'Internal server error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-300 p-4">
      {error && <p className="text-red-500">{error}</p>}
      {user && (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <img src={user.profilePhoto || '/images/image.png'} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
            <h1 className="text-xl font-bold text-teal-700">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-teal-500 text-white py-2 px-4 rounded mb-2 hover:bg-teal-600"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600"
            >
              Change Password
            </button>
          </div>
          {isEditing && (
            <form onSubmit={handleEditProfile} className="mt-4 w-full">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="flex justify-between">
                <button type="submit" className="bg-teal-700 text-white py-2 px-4 rounded hover:bg-teal-800">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
              </div>
            </form>
          )}
          {isChangingPassword && (
            <form onSubmit={handleChangePassword} className="mt-4 w-full">
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-gray-700">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button type="submit" className="bg-emerald-700 text-white py-2 px-4 rounded hover:bg-emerald-800">Change Password</button>
                <button type="button" onClick={() => setIsChangingPassword(false)} className="bg-rose-500 text-white py-2 px-4 rounded hover:bg-rose-600">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:5000/password/reset/${token}`, { password });
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Internal server error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-teal-300 px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="bg-teal-100 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-teal-700">Reset Password</h1>
        <div className="mb-4">
          <label htmlFor="password" className="block text-teal-700">New Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your new password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-teal-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your new password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <button type="submit" className="w-full bg-teal-700 text-teal-50 py-2 rounded hover:bg-teal-800">Submit</button>
      </form>
    </div>
  );
};

export default ResetPassword;

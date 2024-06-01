import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isTokenSent, setIsTokenSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/password/forgot', { email });
      toast.success(response.data.message);
      setIsTokenSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Internal server error');
    }
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    navigate(`/password/reset/${token}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-teal-300 px-4 sm:px-0">
      {!isTokenSent ? (
        <form onSubmit={handleSubmit} className="bg-teal-100 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-teal-700">Forgot Password</h1>
          <div className="mb-4">
            <label htmlFor="email" className="block text-teal-700">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
          <button type="submit" className="w-full bg-teal-700 text-teal-50 py-2 rounded hover:bg-teal-800">Submit</button>
        </form>
      ) : (
        <form onSubmit={handleTokenSubmit} className="bg-teal-100 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-teal-700">Enter Reset Token</h1>
          <div className="mb-4">
            <label htmlFor="token" className="block text-teal-700">Reset Token</label>
            <input
              type="text"
              id="token"
              placeholder="Enter your reset token"
              value={token}
              required
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 border rounded border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
          <button type="submit" className="w-full bg-teal-700 text-teal-50 py-2 rounded hover:bg-teal-800">Submit</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;

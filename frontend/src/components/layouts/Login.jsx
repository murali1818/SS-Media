import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post("http://localhost:5000/login", { email, password });
        const { token } = response.data;
        toast.success(response.data.message);
        Cookies.set('token', token, { expires: 7 });
        navigate('/');
      } else {
        const response = await axios.post("http://localhost:5000/register", { name, email, password });
        const { token } = response.data;
        toast.success(response.data.message);
        Cookies.set('token', token, { expires: 7 });
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
        console.log(error.response.data.message);
      } else {
        toast.error("Internal server error");
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-teal-300 px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="relative bg-teal-100 bg-opacity-90 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md backdrop-blur-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-teal-700">{isLogin ? 'Login' : 'Sign Up'}</h1>
        {!isLogin && (
          <div className="mb-4">
            <label htmlFor="inputName" className="block text-teal-700">Name</label>
            <input
              type="text"
              id="inputName"
              placeholder="Enter your name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="exampleInputEmail1" className="block text-teal-700">Email address</label>
          <input
            type="email"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <div className="mb-4 sm:mb-6">
          <label htmlFor="exampleInputPassword1" className="block text-teal-700">Password</label>
          <input
            type="password"
            id="exampleInputPassword1"
            placeholder="Password"
            autoComplete="off"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        {isLogin && (
          <div className="mb-4 text-right">
            <Link className="text-teal-700 hover:underline" to="/forgotPassword">Forgot Password?</Link>
          </div>
        )}
        <div className="flex items-center justify-between">
          <button type="submit" className="w-full bg-teal-700 text-teal-50 py-2 rounded hover:bg-teal-800">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>
        <div className="mt-4 text-center">
          <button type="button" onClick={toggleForm} className="text-teal-700 hover:underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

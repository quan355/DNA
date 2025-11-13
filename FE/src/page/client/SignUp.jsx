// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/profile');
      } else {
        setError(data.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen md:flex">
      {/* Left Side - Gradient */}
      <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">GoFinance</h1>
          <p className="text-white mt-1">Cho vay P2P hàng đầu Đông Nam Á</p>
          <button
            type="button"
            className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2 hover:bg-gray-100 transition"
          >
            Tìm hiểu
          </button>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 border-white"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 border-white"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 border-white"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 border-white"></div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <form onSubmit={handleSubmit} className="bg-white max-w-md w-full px-6">
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Tạo tài khoản mới</h1>
          <p className="text-sm font-normal text-gray-600 mb-7">Tham gia GoFinance ngay hôm nay!</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Họ và tên"
              required
            />
          </div>

          {/* Username */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Tên đăng nhập"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`block w-full mt-4 py-2 rounded-2xl text-white font-semibold mb-2 transition ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <a href="/login" className="text-indigo-600 hover:underline">
                Đăng nhập
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
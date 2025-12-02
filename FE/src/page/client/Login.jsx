import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
          localStorage.setItem('token', data.token);
          const userWithAvatar = {...data.user,profilePic: data.user.profilePic};
          localStorage.setItem('user', JSON.stringify(userWithAvatar));
          window.dispatchEvent(new Event('userUpdated'));
          navigate('/profile');
          window.location.reload();
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen md:flex">
      {/* Left Side - Gradient + Decorative Circles */}
      <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">DNA</h1>
          <p className="text-white mt-1">Chứa tất cả cá công thức món ăn</p>
          <Link to='/'>
          <button
            type="button"
            className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2 hover:bg-gray-100 transition"
          >
            Tìm hiểu 
          </button>
          </Link>
          
        </div>
        {/* Decorative Circles */}
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 border-white"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 border-white"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 border-white"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 border-white"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <form onSubmit={handleSubmit} className="bg-white max-w-md w-full px-6">
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Chào mừng trở lại!</h1>
          <p className="text-sm font-normal text-gray-600 mb-7">Đăng nhập để tiếp tục</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm animate-pulse">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="User Name"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`block w-full mt-4 py-2 rounded-2xl text-white font-semibold mb-2 transition ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
           {/* Go to SignUp */}
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <a href="/signup" className="text-indigo-600 hover:underline">
                Đăng ký
              </a>
            </span>
          </div>
          {/* Forgot Password */}
          <div className="text-center">
            <Link to="/forgotpassword">
            <span className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer transition">
              Quên mật khẩu?
            </span>
            </Link>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
// src/components/header/DesktopNav.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';

const DesktopNav = ({ menuItems, Logo }) => {
  const navigate = useNavigate();

  // LẤY USER TỪ LOCALSTORAGE
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  return (
    <div className="h-16 flex justify-between items-center px-6 lg:px-12">
      <a href="/">
        <img src={Logo} alt="logo" className="h-10" />
      </a>

      {/* MENU CHÍNH – GIỮ NGUYÊN */}
      <ul className="flex gap-7">
        {menuItems?.map((menu, index) => (
          <li key={index}>
            <Link
              to={`/${menu.toLowerCase()}`}
              className="font-medium capitalize text-secondary hover:text-indigo-600 transition"
            >
              {menu}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4 font-medium">
        {user ? (
          <div className="relative group">
            <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition">
              <CgProfile className="text-2xl" />
              <span className="hidden sm:inline">
                {user.username}
              </span>
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <CgProfile className="text-lg" />
                Hồ sơ
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                </svg>
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <ul className="flex items-center gap-4 font-medium">
            <Link to="/login">
              <li>
                <button className="text-secondary px-4 py-2 rounded hover:bg-gray-100 transition">
                  Login
                </button>
              </li>
            </Link>
            <Link to="/signup">
              <li>
                <button className="text-secondary px-4 py-2 rounded hover:bg-gray-100 transition">
                  Sign Up
                </button>
              </li>
            </Link>
          </ul>
        )}
      </div>
    </div>
  );
};

export default DesktopNav;
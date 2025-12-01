import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';

const DesktopNav = ({ menuItems, Logo }) => {
  const navigate = useNavigate();

  // Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // ID admin (có thể chuyển ra file config sau này)
  const ADMIN_ID = '69145fe222296799e2c5f5d8';
  const isAdmin = user && user._id === ADMIN_ID;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  return (
    <div className="h-16 flex justify-between items-center px-6 lg:px-12 bg-white shadow-sm">
      {/* Logo */}
      <a href="/">
        <img src={Logo} alt="logo" className="h-10" />
      </a>

      {/* MENU CHÍNH – ĐÃ SỬA ĐỂ DÙNG ĐÚNG CẤU TRÚC OBJECT */}
      <ul className="flex gap-7">
        {menuItems?.map((item) => (
          <li key={item.label}>
            <Link
              to={item.to} // dùng item.to thay vì tự động toLowerCase()
              className="font-medium capitalize text-secondary hover:text-indigo-600 transition"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* PHẦN USER / ADMIN / LOGIN */}
      <div className="flex items-center">
        {user ? (
          <div className="relative group">
            <button className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition font-medium">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
                />
              ) : (
                <CgProfile className="text-3xl" />
              )}
              <span className="hidden sm:inline">
                {user.fullName || user.username}
              </span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown gộp */}
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              {/* Hồ sơ cá nhân */}
              <Link
                to="/profile"
                className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-indigo-50 transition"
              >
                <CgProfile className="text-xl" />
                Hồ sơ cá nhân
              </Link>

              {/* Chỉ hiện khi là Admin */}
              {isAdmin && (
                <>
                  <div className="border-t border-gray-200">
                    <Link
                      to="/adminprod"
                      className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-indigo-50 transition border-b"
                    >
                      Duyệt công thức chờ
                    </Link>
                    <Link
                      to="/usermanager"
                      className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-indigo-50 transition border-b"
                    >
                      Quản lý người dùng
                    </Link>
                  </div>
                </>
              )}

              {/* Đăng xuất */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-6 py-4 text-red-600 hover:bg-red-50 transition border-t font-medium"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          /* Chưa đăng nhập → Đăng nhập / Đăng ký */
          <div className="flex items-center gap-4">
            <Link to="/login">
              <button className="text-secondary px-6 py-2.5 rounded-lg hover:bg-gray-100 transition font-medium">
                Đăng Nhập
              </button>
            </Link>
            <Link to="/signup">
              <button className="text-secondary px-6 py-2.5 rounded-lg hover:bg-gray-100 transition font-medium">
                Đăng Ký
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopNav;
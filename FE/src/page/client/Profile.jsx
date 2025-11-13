// src/page/client/Profile.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../../assets/ava.png'; // ĐÚNG ĐƯỜNG DẪN

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Chỉnh sửa
  const handleEdit = () => {
    alert('Tính năng chỉnh sửa đang được phát triển!');
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Card chính */}
        <div className="bg-white rounded-2xl p-6 md:p-10 ">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* CỘT TRÁI: Avatar + Nút */}
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="relative">    
                <img
                  src={user.profilePic || avatar}
                  alt="Ảnh đại diện"
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-indigo-800 shadow-xl transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = avatar;
                  }}
                />
              </div>

              <div className="mt-6 space-y-3 w-full max-w-xs">
                <button
                  onClick={handleEdit}
                  className="w-full bg-indigo-800 text-white font-semibold py-3 rounded-xl hover:bg-indigo-900 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                >
                  Chỉnh sửa hồ sơ
                </button>
              </div>
              <Link to='/create'>
              <div className="mt-6 space-y-3 w-full max-w-xs">
                <button
                  
                  className="w-full bg-indigo-800 text-white font-semibold py-3 rounded-xl hover:bg-indigo-900 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                >
                  Create Recipes
                </button>
              </div>
              </Link>
              
            </div>

            {/* CỘT PHẢI: Thông tin */}
            <div className="md:w-2/3 space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-indigo-800">
                  {user.fullName || 'Chưa có tên'}
                </h1>
                <p className="text-lg text-gray-600 mt-1">Thành viên DNA</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-indigo-800 mb-3">
                  Thông tin tài khoản
                </h2>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Username:</span>{' '}
                    <span className="text-indigo-600">{user.username}</span>
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-indigo-800 mb-3">
                  Thông tin liên hệ
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-indigo-800" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="font-medium">Email:</span> {user.email}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-indigo-800" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="font-medium">SĐT:</span> {user.phone || 'Chưa cập nhật'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Profile;
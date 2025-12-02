import React, { useState, useEffect } from 'react';
import {  useNavigate, Link } from 'react-router-dom';
import profilePic from '../../assets/ava.png';
import axios from 'axios';
import SmartItemList from '../../components/SmartListProduct.jsx';
import { FaHeart } from 'react-icons/fa';
import SavedRecipes from '../../components/SavedRecipes.jsx';

const token = localStorage.getItem('token');


const Profile = () => {
 const [user, setUser] = useState(() => {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : {};
});

useEffect(() => {
  setUser(JSON.parse(localStorage.getItem('user') || 'null'));
}, [localStorage.getItem('user')]);
useEffect(() => {
  const handleStorageChange = () => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  };
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
// Lấy danh sách công thức đã lưu
  const [activeTab, setActiveTab] = useState('saved');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
  if (token && user?._id) {
    axios.get('http://localhost:5000/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setSavedItems(res.data.data || []);
    }).catch(() => {
      setSavedItems([]);
    }).finally(() => setSavedLoading(false));
  }
}, [token, user]);
  useEffect(() => {
  const userId = user?._id;

  if (!userId) {
    alert('User không hợp lệ!');
    navigate('/login');
  return;
  }
  axios
    .get("http://localhost:5000/api/itemscreatedby", {
      params: { 
        q: userId,
        _t: Date.now()   
      },
      headers: {
        'Cache-Control': 'no-cache'  
      }
    })
    .then((res) => {
      console.log('API trả về:', res.data);
      setItems(Array.isArray(res.data) ? res.data : []);
    })
    .catch((err) => {
      console.log("Lỗi lấy món:", err);
      setItems([]);
    })
    .finally(() => {
      setLoading(false);
    });

}, []);
  // ===== STATE CHO MODAL CHỈNH SỬA  =====
const [isEditModal, setIsEditModal] = useState(false);
const [msg, setMsg] = useState('');

// Dữ liệu chỉnh sửa – chỉ những field được phép sửa + địa chỉ
const [editData, setEditData] = useState({
  phone: user.phone || '',
  country: user.country || '',
  city: user.city || '',
  district: user.district || '',
  profilePic: user.profilePic || ''
});

const [imagePreview, setImagePreview] = useState(user.profilePic || profilePic);
// Mở modal – load lại dữ liệu mới nhất
const openEdit = () => {
  setEditData({
    phone: user.phone || '',
    country: user.country || 'Việt Nam',
    city: user.city || '',
    district: user.district || '',
    profilePic: user.profilePic || ''
  });
  setImagePreview(user.profilePic || profilePic);
  setMsg('');
  setIsEditModal(true);
};

// Upload ảnh đại diện
 const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Preview ngay
  const reader = new FileReader();
  reader.onloadend = () => setImagePreview(reader.result);
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append('image', file);

  try {
    // ĐÃ SỬA: DÙNG POST + ĐÚNG ĐƯỜNG DẪN + ĐÚNG RESPONSE
    const res = await axios.post('http://localhost:5000/api/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // ĐÃ SỬA: backend trả imageUrl, không phải profilePic
    setEditData({ ...editData, profilePic: res.data.imageUrl });
    setImagePreview(res.data.imageUrl);
    setMsg('Upload ảnh thành công!');

  } catch (err) {
    console.error('Lỗi upload:', err.response?.data || err.message);
    setMsg('Lỗi upload ảnh: ' + (err.response?.data?.message || err.message));
  }
};

// Lưu thay đổi (chỉ gửi những field được phép)
const handleSave = async () => {
  try {
    const res = await axios.put('http://localhost:5000/api/user/update', editData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updatedUserFromServer = res.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUserFromServer));
    setUser(updatedUserFromServer);
    alert('Cập nhật thành công!');
    setIsEditModal(false);
  } catch (err) {
    alert('Lỗi rồi!');
  }
};
  
  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Card thông tin cá nhân */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* profilePic */}
            <div className="md:w-1/3 flex flex-col items-center">
              <img
                src={user.profilePic || profilePic}
                alt="profilePic"
                className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#9c702a] shadow-2xl hover:scale-105 transition-transform"
                onError={(e) => (e.target.src = profilePic)}
              />
              <div className="mt-8 space-y-4 w-full max-w-xs">
                <Link to="/create">
              <button className="w-full bg-[#9c702a] text-white font-bold py-3 rounded-xl hover:bg-[#825102] transition shadow-lg text-lg">
                  Tạo Công Thức
                </button>
              </Link>
              </div>
              <div className="mt-1 space-y-4 w-full max-w-xs">
              <button onClick={openEdit} className="w-full bg-[#9c702a] text-white font-bold py-3 rounded-xl hover:bg-[#825102] transition shadow-lg text-lg">
                  Chỉnh Sửa Hồ Sơ
                </button>
              </div>
              
            </div>

            {/* Thông tin */}
            <div className="md:w-2/3 space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-[#9c702a]">
                  {user.fullName || user.username || 'Ẩm thực gia'}
                </h1>
                <p className="text-lg text-gray-600 mt-1">Thành viên DNA</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-[#9c702a] mb-4">Thông tin tài khoản</h2>
                <p><span className="font-medium">Username:</span> <span className="text-[#9c702a]">@{user.username}</span></p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-[#9c702a] mb-4">Liên hệ</h2>
                <p className="flex items-center gap-3"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">/* icon email */</svg> {user.email}</p>
                <p className="flex items-center gap-3 mt-2"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">/* icon phone */</svg> {user.phone || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>
        </div>
       <div className="mt-20">
  
          </div>
      </div>
      <div className="mt-16">
          <button
            onClick={() => setActiveTab('saved')}
            className={`... ${activeTab === 'saved' ? 'text-orange-600 border-b-4 border-orange-600' : ''}`}
          >
            Công thức đã lưu 
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className={`tab-button ${activeTab === 'created' ? 'text-orange-600 border-b-4 border-orange-600' : ''}`}
          >
            Công thức đã tạo
          </button>
          
          {activeTab === 'saved' && <SavedRecipes />}
          {
            activeTab === 'created' && <SmartItemList userId={user._id} />
          }
        </div>
          {/* ================== MODAL CHỈNH SỬA ================== */}
          {isEditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold text-center text-[#9c702a] mb-8">Thông tin cá nhân</h2>

      {/* Ảnh đại diện – ĐƯỢC SỬA */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <img 
            src={imagePreview || '/public/ava.png'} 
            alt="profilePic" 
            className="w-32 h-32 rounded-full object-cover border-4 border-[#9c702a] shadow-lg"
          />
          <label className="absolute bottom-0 right-0 bg-[#9c702a] p-3 rounded-full cursor-pointer hover:bg-[#825102] transition">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>
      </div>

      <div className="space-y-5">

        {/* Họ tên – KHÔNG SỬA ĐƯỢC */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Họ và tên</label>
          <input 
            type="text" 
            value={user.fullName || ''} 
            disabled 
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Username – KHÔNG SỬA ĐƯỢC */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Tên đăng nhập</label>
          <input 
            type="text" 
            value={user.username || ''} 
            disabled 
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Email – KHÔNG SỬA ĐƯỢC */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input 
            type="email" 
            value={user.email || ''} 
            disabled 
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Số điện thoại – ĐƯỢC SỬA */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
          <input 
            type="text" 
            value={editData.phone || ''}
            onChange={e => setEditData({...editData, phone: e.target.value})}
            placeholder="Nhập số điện thoại mới"
            className="w-full px-4 py-3 border-2 rounded-xl focus:border-[#9c702a] outline-none transition"
          />
        </div>

        {/* Quốc gia – có thể để fixed hoặc cho sửa nhẹ */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Quốc gia</label>
          <input 
            type="text" 
            value={editData.country || ''} 
            onChange={e => setEditData({...editData, country: e.target.value})}
            className="w-full px-4 py-3 border-2 rounded-xl focus:border-[#9c702a] outline-none transition"
          />
        </div>

        {/* Tỉnh/Thành phố – ĐƯỢC SỬA */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Tỉnh/Thành phố</label>
          <input 
            type="text" 
            value={editData.city || ''}
            onChange={e => setEditData({...editData, city: e.target.value})}
            placeholder="Ví dụ: TP. Hồ Chí Minh"
            className="w-full px-4 py-3 border-2 rounded-xl focus:border-[#9c702a] outline-none transition"
          />
        </div>

        {/* Quận/Huyện – ĐƯỢC SỬA */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Quận/Huyện</label>
          <input 
            type="text" 
            value={editData.district || ''}
            onChange={e => setEditData({...editData, district: e.target.value})}
            placeholder="Ví dụ: Quận 1"
            className="w-full px-4 py-3 border-2 rounded-xl focus:border-[#9c702a] outline-none transition"
          />
        </div>

      </div>

      {/* Nút Lưu / Hủy */}
      <div className="flex gap-4 mt-8">
        {/* NÚT LƯU */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 bg-[#9c702a] text-white py-3 rounded-xl font-bold hover:bg-[#825102] disabled:opacity-70 transition shadow-lg"
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>

        {/* NÚT HỦY */}
        <button
          onClick={() => setIsEditModal(false)}   
          className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition shadow-lg"
        >
          Hủy
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    
  );
};

export default Profile;
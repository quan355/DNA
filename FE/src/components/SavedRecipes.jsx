import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';
import { FaHeart } from 'react-icons/fa';

const SavedRecipes = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('Vui lòng đăng nhập để xem công thức đã lưu');
      setLoading(false);
      return;
    }

    const fetchSaved = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/saved', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedItems(res.data.data || []);
      } catch (err) {
        console.error('Lỗi lấy công thức đã lưu:', err);
        setError('Không thể tải công thức đã lưu');
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <FaHeart className="text-6xl  mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Bạn chưa đăng nhập</h2>
            <p className="text-gray-600 text-lg">Đăng nhập để xem những công thức bạn đã lưu </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br   py-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Tiêu đề đẹp */}
        <div className="text-center mb-12">
          <h2 className="text-center text-3xl md:text-5xl font-bold text-secondary mb-12">
            Công thức đã lưu
          </h2>
          <p className="text-xl text-gray-600 mt-4">
            {savedItems.length > 0 
              ? `Bạn đã lưu ${savedItems.length} công thức yêu thích` 
              : 'Chưa có công thức nào được lưu'}
          </p>
        </div>

        {/* Nội dung */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 min-h-[600px]">
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4border-t-transparent"></div>
              <p className="mt-4 text-gray-600 text-lg">Đang tải công thức đã lưu...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className=" text-xl">{error}</p>
            </div>
          )}

          {!loading && !error && savedItems.length === 0 && (
            <div className="text-center py-20">
              <FaHeart className="text-8xl text-gray-200 mx-auto mb-6" />
              <p className="text-2xl text-gray-500">Bạn chưa lưu công thức nào</p>
              <p className="text-gray-400 mt-4">Khám phá và nhấn để lưu những món ngon nhé!</p>
            </div>
          )}

          {!loading && !error && savedItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {savedItems.map(item => (
                <Card key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedRecipes;
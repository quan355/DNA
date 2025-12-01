// src/components/UserItems.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

const UserItems = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/itemscreatedby", {
        params: { q: userId, _t: Date.now() },
        headers: { 'Cache-Control': 'no-cache' }
      })
      .then((res) => {
        console.log('Món ăn của user:', res.data);
        setItems(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Lỗi lấy món ăn:", err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#9c702a]"></div>
        <p className="mt-4 text-gray-600">Đang tải món ăn của bạn...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl">
        <p className="text-xl text-gray-600 mb-4">Bạn chưa đăng món ăn nào</p>
        <button
          onClick={() => navigate('/create')}
          className="px-8 py-3 bg-[#9c702a] text-white rounded-xl font-bold hover:bg-[#825102] transition shadow-lg"
        >
          Đăng món đầu tiên ngay!
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-secondary mb-6">
        Món ăn của bạn ({items.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default UserItems;
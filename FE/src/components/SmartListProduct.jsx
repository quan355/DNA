// src/components/SmartItemList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';

const SmartItemList = ({
  userId,                
  apiUrl = "http://localhost:5000/api/all-items",
  limit = 9,
  title = "Công thức nổi bật",
  showTitle = true,
  emptyMessage = "Chưa có công thức nào",
  className = ""
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });
  const navigate = useNavigate();

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      let url = '';
      let params = {};

      if (userId) {
        url = "http://localhost:5000/api/itemscreatedby";
        params = { q: userId, page, limit };
      } else {
        url = apiUrl;
        params = { page, limit };
      }

      const res = await axios.get(url, { params });

      const dataItems = res.data.items || res.data || [];
      const total = res.data.total || res.data.length || dataItems.length;

      setItems(Array.isArray(dataItems) ? dataItems : []);
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      });

    } catch (err) {
      console.error('Lỗi tải món ăn:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [userId, apiUrl]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.currentPage) {
      fetchData(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br py-16 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Tiêu đề đẹp - giống SavedRecipes */}
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-center text-3xl md:text-5xl font-bold text-secondary mb-4">
              {userId ? `Món ăn của bạn` : title}
            </h2>
            <p className="text-xl text-gray-600 mt-4">
              {items.length > 0 
                ? `${userId ? 'Bạn đã tạo' : 'Có'} ${items.length} công thức ${userId ? '' : 'nổi bật'}` 
                : emptyMessage}
            </p>
          </div>
        )}

        {/* Nội dung - giống SavedRecipes */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 min-h-[600px]">
          
          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 text-lg">Đang tải món ngon...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && items.length === 0 && (
            <div className="text-center py-20">
              <FaUtensils className="text-8xl text-gray-200 mx-auto mb-6" />
              <p className="text-2xl text-gray-500">{emptyMessage}</p>
              {userId && (
                <>
                  <p className="text-gray-400 mt-4">Bắt đầu chia sẻ những món ngon của bạn!</p>
                  <button
                    onClick={() => navigate('/create')}
                    className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
                  >
                    Đăng món đầu tiên
                  </button>
                </>
              )}
            </div>
          )}

          {/* Grid card */}
          {!loading && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {items.map((item) => {
                const safeItem = {
                  ...item,
                  _id: item._id || item.id,
                  thumbnail_image: item.thumbnail_image || item.image || '/placeholder.jpg'
                };
                return <Card key={safeItem._id} item={safeItem} />;
              })}
            </div>
          )}
        </div>

        {/* Phân trang - ngoài box trắng */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev || loading}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                pagination.hasPrev && !loading 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Trước
            </button>

            <div className="flex gap-2">
              {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                const pageNum = pagination.currentPage <= 4 
                  ? i + 1 
                  : pagination.currentPage >= pagination.totalPages - 3 
                    ? pagination.totalPages - 6 + i 
                    : pagination.currentPage - 3 + i;

                if (pageNum < 1 || pageNum > pagination.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-12 h-12 rounded-lg font-bold transition ${
                      pagination.currentPage === pageNum 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-indigo-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext || loading}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                pagination.hasNext && !loading 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartItemList;
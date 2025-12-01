// src/components/SmartItemList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

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
    <div className={`py-12 ${className}`}>
      {showTitle && (
        <h2 className="text-center text-3xl md:text-5xl font-bold text-secondary mb-12">
          {userId ? `Món ăn của bạn (${items.length})` : title}
        </h2>
      )}

      {/* Loading – giống hệt ListProduct */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-8 border-indigo-600 border-t-transparent"></div>
          <p className="ml-4 text-xl">Đang tải món ngon...</p>
        </div>
      )}

      {/* Grid card – giống hệt 100% ListProduct */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
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

      {/* Empty state – giống hệt ListProduct */}
      {!loading && items.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-500">{emptyMessage}</p>
          {userId && (
            <button
              onClick={() => navigate('/create')}
              className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
            >
              Đăng món đầu tiên
            </button>
          )}
        </div>
      )}

      {/* Phân trang – giống hệt 100% ListProduct */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-12">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev || loading}
            className={`p-3 rounded-lg ${pagination.hasPrev && !loading ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400'}`}
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
                  className={`w-10 h-10 rounded-lg font-bold text-sm ${pagination.currentPage === pageNum ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext || loading}
            className={`p-3 rounded-lg ${pagination.hasNext && !loading ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400'}`}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartItemList;
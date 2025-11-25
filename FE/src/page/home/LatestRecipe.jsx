// src/components/LatestRecipe.jsx  (hoặc đường dẫn hiện tại của bạn)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';

const LatestRecipe = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/all-items?limit=8");
        
        // Hỗ trợ cả 2 kiểu trả về: { items: [...] } hoặc mảng trực tiếp
        const data = res.data.items || res.data || [];
        setItems(data);
      } catch (err) {
        console.error("Lỗi tải món mới nhất:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  return (
    <section className="px-5 xl:px-32 py-20 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Tiêu đề */}
        <h2 className="text-center text-4xl md:text-5xl font-bold text-secondary mb-16">
          Món ngon mới nhất
        </h2>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80 animate-pulse" />
            ))}
          </div>
        )}

        {/* Danh sách 4 món mới nhất */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items
              .slice(0, 4) // chỉ lấy 4 món mới nhất
              .map((item) => (
                <Card 
                  key={item._id || item.id} 
                  item={item} 
                />
              ))}
          </div>
        )}

        {/* Không có món nào */}
        {!loading && items.length === 0 && (
          <p className="text-center text-xl text-gray-500 py-20">
            Chưa có công thức nào
          </p>
        )}

        {/* Nút xem tất cả */}
        <div className="text-center mt-16">
          <Link to="/recipes">
            <button className="py-4 px-8 hover:bg-btncolor text-secondary hover:text-white 
                         transition ease-in duration-200 text-center text-base font-semibold border border-[#9c702a]
                        focus:outline-none rounded-lg">
              Xem tất cả công thức
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default LatestRecipe;
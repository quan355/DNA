import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailRecipe, setDetailRecipe] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const token = localStorage.getItem('token');

  // Lấy danh sách chờ duyệt
  const fetchPending = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(res.data.data || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi tải danh sách chờ duyệt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // Xem chi tiết
  const viewDetail = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/pending/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDetailRecipe(res.data.data);
      setShowDetail(true);
    } catch (err) {
      alert('Không thể xem chi tiết công thức');
    }
  };

  // Duyệt công thức
  const approve = async (id) => {
    if (!window.confirm('Bạn có chắc muốn DUYỆT công thức này?')) return;

    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Đã duyệt thành công! Công thức đã được đăng.');
      setRecipes(prev => prev.filter(r => r._id !== id));
      setShowDetail(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi duyệt công thức');
    }
  };

  // Từ chối công thức
  const reject = async (id) => {
    if (!window.confirm('Bạn có chắc muốn TỪ CHỐI và XÓA công thức này?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/reject/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Đã từ chối và xóa công thức khỏi danh sách chờ.');
      setRecipes(prev => prev.filter(r => r._id !== id));
      setShowDetail(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi từ chối công thức');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Đang tải danh sách...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-700">Quản lý công thức chờ duyệt</h1>
          <p className="text-gray-600 mt-2">Tổng cộng: <strong>{recipes.length}</strong> công thức đang chờ</p>
        </div>

        {recipes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-16 text-center">
            <p className="text-2xl text-gray-500">Không có công thức nào đang chờ duyệt</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe._id} onClick={() => viewDetail(recipe._id)} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                <img
                  src={recipe.thumbnail_image}
                  alt={recipe.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">{recipe.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">Danh mục: <strong>{recipe.category}</strong></p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => viewDetail(recipe._id)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal chi tiết */}
      {showDetail && detailRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{detailRecipe.name}</h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-3xl text-gray-500 hover:text-gray-800"
                >
                  ×
                </button>
              </div>

              <img
                src={detailRecipe.thumbnail_image}
                alt={detailRecipe.name}
                className="w-full h-96 object-cover rounded-lg mb-6"
              />

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-lg mb-3 text-indigo-700">Thông tin chi tiết</h3>
                  <div className="space-y-2">
                    <p><strong>Chuẩn bị:</strong> {detailRecipe.more.prep_time}</p>
                    <p><strong>Nấu:</strong> {detailRecipe.more.cook_time}</p>
                    <p><strong>Phần ăn:</strong> {detailRecipe.more.serving_time}</p>
                    <p><strong>Độ khó:</strong> {detailRecipe.more.difficulty}</p>
                    {detailRecipe.more.source && <p><strong>Nguồn:</strong> {detailRecipe.more.source}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 text-indigo-700">Nguyên liệu</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {detailRecipe.ingredients.map((ing, i) => (
                      <li key={i}>{ing.name} — {ing.quantity}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-lg mb-3 text-indigo-700">Hướng dẫn nấu</h3>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {detailRecipe.instructions}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => approve(detailRecipe._id)}
                  className="flex-1 bg-green-600 text-white py-4 rounded-lg text-lg font-bold hover:bg-green-700 transition"
                >
                  DUYỆT CÔNG THỨC NÀY
                </button>
                <button
                  onClick={() => reject(detailRecipe._id)}
                  className="flex-1 bg-red-600 text-white py-4 rounded-lg text-lg font-bold hover:bg-red-700 transition"
                >
                  TỪ CHỐI & XÓA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
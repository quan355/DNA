// src/page/client/AddProduct.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    menuId:'',
    name: '',
    thumbnail_image: '',
    category: '',
    instructions: [],
    ingredients: [],
    comments: [],
    more: [],
  });

  // Các state tạm để nhập từng dòng
  const [newInstruction, setNewInstruction] = useState('');
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientQuantity, setNewIngredientQuantity] = useState('');
  const [newPrepTime, setNewPrepTime] = useState('');
  const [newCookTime, setNewCookTime] = useState('');
  const [newServing, setNewServing] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('');
  const [newSource, setNewSource] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');
if (!user) {
  alert('User không hợp lệ!');
  navigate('/login');
  return;
}

  // Thêm instruction
  const addInstruction = () => {
    if (newInstruction.trim()) {
      setFormData((prev) => ({
        ...prev,
        instructions: [...prev.instructions, newInstruction.trim()],
      }));
      setNewInstruction('');
    }
  };

  // Thêm ingredient
  const addIngredient = () => {
    if (newIngredientName.trim() && newIngredientQuantity.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, { name: newIngredientName.trim(), quantity: newIngredientQuantity.trim() }],
      }));
      setNewIngredientName('');
      setNewIngredientQuantity('');
    }
  };
  // Thêm more
  const addMore = () => {
    if (newPrepTime || newCookTime || newServing || newDifficulty || newSource) {
      setFormData((prev) => ({
        ...prev,
        more: [
          ...prev.more,
          {
            prep_time: newPrepTime.trim(),
            cook_time: newCookTime.trim(),
            serving_time: newServing.trim(),
            difficulty: newDifficulty.trim(),
            source: newSource.trim(),
          },
        ],
      }));
      setNewPrepTime('');
      setNewCookTime('');
      setNewServing('');
      setNewDifficulty('');
      setNewSource('');
    }
  };

  // Xóa mục
  const removeItem = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        menuId,
        name: formData.name,
        thumbnail_image: formData.thumbnail_image,
        category: formData.category,
        instructions: formData.instructions.join('\n'),
        tags: [],
        ingredients: formData.ingredients,
        comments: formData.comments,
        more: formData.more,
        createdBy: user._id,
      };

      const res = await axios.post('http://localhost:5000/api/add-item', payload);
      if (res.data.success) {
        setSuccess('Thêm sản phẩm thành công!');
        setTimeout(() => navigate('/profile'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi thêm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-4xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Thêm công thức mới</h2>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">

            {/* Tên công thức */}
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Tên công thức</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="VD:Phở bò truyền thống"
                required
              />
            </div>

            {/* Thumbnail */}
            <div className="sm:col-span-2">
              <label htmlFor="thumbnail_image" className="block mb-2 text-sm font-medium text-gray-900">Hình ảnh (URL)</label>
              <input
                type="url"
                name="thumbnail_image"
                value={formData.thumbnail_image}
                onChange={(e) => setFormData({ ...formData, thumbnail_image: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="https://example.com/pho-bo.jpg"
                required
              />
            </div>

            {/* Danh mục */}
            <div>
              <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">Danh mục</label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                required
              >
                <option value="">Chọn danh mục</option>
                <option value="Entress">Entress</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Desserts">Desserts</option>
                <option value="Sides">Sides</option>
                <option value="Drink">Drink</option>
              </select>
            </div>

            {/* === HƯỚNG DẪN (Instructions) === */}
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">Hướng dẫn nấu (thêm từng bước)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2"
                  placeholder="VD:Luộc xương bò trong 6 tiếng..."
                />
                <button
                  type="button"
                  onClick={addInstruction}
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
              <div className="space-y-1">
                {formData.instructions.map((inst, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{i + 1}. {inst}</span>
                    <button
                      type="button"
                      onClick={() => removeItem('instructions', i)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* === NGUYÊN LIỆU (Ingredients) === */}
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">Nguyên liệu (thêm từng loại)</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2"
                  placeholder="Tên (VD: Xương bò)"
                />
                <input
                  type="text"
                  value={newIngredientQuantity}
                  onChange={(e) => setNewIngredientQuantity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2"
                  placeholder="Số lượng (VD: 2kg)"
                />
              </div>
              <button
                type="button"
                onClick={addIngredient}
                className="mb-2 px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                Thêm nguyên liệu
              </button>
              <div className="space-y-1">
                {formData.ingredients.map((ing, i) => (
                  <div key={i} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{ing.name}: {ing.quantity}</span>
                    <button
                      type="button"
                      onClick={() => removeItem('ingredients', i)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* === THÔNG TIN BỔ SUNG (More) === */}
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">Thông tin bổ sung</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                <input type="text" value={newPrepTime} onChange={(e) => setNewPrepTime(e.target.value)} className="bg-gray-50 border p-2 text-sm rounded" placeholder="Thời gian chuẩn bị" />
                <input type="text" value={newCookTime} onChange={(e) => setNewCookTime(e.target.value)} className="bg-gray-50 border p-2 text-sm rounded" placeholder="Thời gian nấu" />
                <input type="text" value={newServing} onChange={(e) => setNewServing(e.target.value)} className="bg-gray-50 border p-2 text-sm rounded" placeholder="Khẩu phần" />
                <input type="text" value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value)} className="bg-gray-50 border p-2 text-sm rounded" placeholder="Độ khó" />
                <input type="text" value={newSource} onChange={(e) => setNewSource(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMore())} className="bg-gray-50 border p-2 text-sm rounded" placeholder="Nguồn" />
              </div>
              <button
                type="button"
                onClick={addMore}
                className="mb-2 px-3 py-1 text-sm text-white bg-purple-600 rounded hover:bg-purple-700"
              >
                Thêm thông tin
              </button>
              <div className="space-y-1">
                {formData.more.map((m, i) => (
                  <div key={i} className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                    <span>
                      {m.prep_time} | {m.cook_time} | {m.serving_time} | {m.difficulty} | {m.source}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem('more', i)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Nút submit */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-6 inline-flex items-center px-5 py-2.5 text-sm font-medium text-secondary rounded-lg transition ${
              loading ? 'bg-primary-400 cursor-not-allowed opacity-75' : 'bg-primary-700 hover:bg-primary-800'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang thêm...
              </>
            ) : (
              'Thêm công thức'
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddProduct;
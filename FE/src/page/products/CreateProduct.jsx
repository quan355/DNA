// src/pages/client/AddProduct.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    alert('Vui lòng đăng nhập để thêm công thức!');
    navigate('/login');
    return null;
  }

  const [formData, setFormData] = useState({
    name: '',
    thumbnail_image: '',     // ← sẽ nhận URL từ server sau khi upload
    category: '',
    instructions: [],
    ingredients: [],
    more: {
      prep_time: '',
      cook_time: '',
      serving_time: '',
      difficulty: '',
      source: ''
    }
  });

  // State cho ảnh
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // State tạm
  const [currentStep, setCurrentStep] = useState('');
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  // === TẢI ẢNH LÊN SERVER ===
  const handleImageUpload = async (file) => {
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    setUploadingImage(true);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const imageUrl = res.data.imageUrl; // ← backend trả về URL ảnh
      setFormData(prev => ({ ...prev, thumbnail_image: imageUrl }));
      setImagePreview(imageUrl);
      alert('Tải ảnh lên thành công!');
    } catch (err) {
      alert('Lỗi tải ảnh: ' + (err.response?.data?.message || 'Không thể upload'));
    } finally {
      setUploadingImage(false);
    }
  };

  // Khi chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // preview ngay
      handleImageUpload(file); // tự động upload luôn
    }
  };

  // Thêm bước
  const addStep = () => {
    if (currentStep.trim()) {
      setFormData(prev => ({
        ...prev,
        instructions: [...prev.instructions, currentStep.trim()]
      }));
      setCurrentStep('');
    }
  };

  const removeStep = (i) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, idx) => idx !== i)
    }));
  };

  // Nguyên liệu
  const addIngredient = () => {
    if (ingredientName.trim() && ingredientQuantity.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, {
          name: ingredientName.trim(),
          quantity: ingredientQuantity.trim()
        }]
      }));
      setIngredientName('');
      setIngredientQuantity('');
    }
  };

  const removeIngredient = (i) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, idx) => idx !== i)
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return alert('Nhập tên công thức');
    if (!formData.thumbnail_image) return alert('Chọn ảnh hoặc nhập link ảnh');
    if (!formData.category) return alert('Chọn danh mục');
    if (formData.instructions.length === 0) return alert('Thêm ít nhất 1 bước hướng dẫn');
    if (formData.ingredients.length === 0) return alert('Thêm ít nhất 1 nguyên liệu');
    if (!formData.more.prep_time || !formData.more.cook_time || !formData.more.serving_time || !formData.more.difficulty) {
      return alert('Điền đầy đủ thông tin bổ sung');
    }

    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      thumbnail_image: formData.thumbnail_image,
      category: formData.category,
      instructions: formData.instructions.join('\n\n'),
      ingredients: formData.ingredients,
      more: {
        prep_time: formData.more.prep_time.trim(),
        cook_time: formData.more.cook_time.trim(),
        serving_time: formData.more.serving_time.trim(),
        difficulty: formData.more.difficulty.trim(),
        source: formData.more.source.trim() || 'Người dùng chia sẻ'
      },
      createdBy: user._id
    };

    try {
      await axios.post('http://localhost:5000/api/add-witem', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Gửi công thức thành công! Đang chờ Admin duyệt...');
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi gửi công thức');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">
          Chia sẻ công thức của bạn
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Tên & Ảnh */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tên công thức</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Phở bò tái nạm"
                required
              />
            </div>

            {/* TẢI ẢNH LÊN */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Hình ảnh món ăn <span className="text-xs text-gray-500"></span>
              </label>

              {/* Preview ảnh */}
              {imagePreview && (
                <div className="mb-4">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow" />
                </div>
              )}

              <div className="flex ">
                <label className="flex-1 cursor-pointer">
                  <div className="px-6 py-3 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 font-medium">
                    {uploadingImage ? 'Đang tải lên...' : 'Chọn ảnh từ máy'}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
                <input
                  type="url"
                  value={formData.thumbnail_image}
                  onChange={e => {
                    setFormData({ ...formData, thumbnail_image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="Dán link ảnh"
                  className="flex-1 px-4 ml-0 py-3 border rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Chọn danh mục</option>
              <option value="Entress">Entress</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Desserts">Desserts</option>
              <option value="Side">Side</option>
              <option value="Drinks">Drinks</option>
            </select>
          </div>

          {/* Hướng dẫn – từng bước */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Hướng dẫn nấu (từng bước)</label>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={currentStep}
                onChange={e => setCurrentStep(e.target.value)}
                className="flex-1 px-4 py-3 border rounded-lg"
                placeholder="Bước 1: Luộc xương bò..."
              />
              <button type="button" onClick={addStep} className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Thêm bước
              </button>
            </div>
            <div className="space-y-3">
              {formData.instructions.map((step, i) => (
                <div key={i} className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <span className="font-medium">Bước {i + 1}: {step}</span>
                  <button type="button" onClick={() => removeStep(i)} className="text-red-600 hover:text-red-800 font-medium">
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Nguyên liệu */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Nguyên liệu</label>
            <div className="flex gap-3 mb口碑-4">
              <input type="text" value={ingredientName} onChange={e => setIngredientName(e.target.value)} placeholder="Tên" className="flex-1 px-4 py-3 border rounded-lg" />
              <input type="text" value={ingredientQuantity} onChange={e => setIngredientQuantity(e.target.value)} onKeyPress={e => e.key === 'Enter' && addIngredient()} placeholder="Số lượng" className="w-40 px-4 py-3 border rounded-lg" />
              <button type="button" onClick={addIngredient} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Thêm</button>
            </div>
            <div className="space-y-2">
              {formData.ingredients.map((ing, i) => (
                <div key={i} className="flex justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                  <span>{ing.name} — {ing.quantity}</span>
                  <button type="button" onClick={() => removeIngredient(i)} className="text-red-600">Xóa</button>
                </div>
              ))}
            </div>
          </div>

          {/* Thông tin bổ sung */}
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
            <h3 className="font-bold text-lg text-purple-800 mb-4">Thông tin bổ sung</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <input value={formData.more.prep_time} onChange={e => setFormData({...formData, more: {...formData.more, prep_time: e.target.value}})} placeholder="Chuẩn bị" className="px-3 py-2 border rounded text-sm" required />
              <input value={formData.more.cook_time} onChange={e => setFormData({...formData, more: {...formData.more, cook_time: e.target.value}})} placeholder="Nấu" className="px-3 py-2 border rounded text-sm" required />
              <input value={formData.more.serving_time} onChange={e => setFormData({...formData, more: {...formData.more, serving_time: e.target.value}})} placeholder="Khẩu phần" className="px-3 py-2 border rounded text-sm" required />
              <input value={formData.more.difficulty} onChange={e => setFormData({...formData, more: {...formData.more, difficulty: e.target.value}})} placeholder="Độ khó" className="px-3 py-2 border rounded text-sm" required />
              <input value={formData.more.source} onChange={e => setFormData({...formData, more: {...formData.more, source: e.target.value}})} placeholder="Nguồn (tùy chọn)" className="px-3 py-2 border rounded text-sm" />
            </div>
          </div>

          {/* Gửi */}
          <div className="text-center pt-8">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className={`px-16 py-5 text-xl font-bold text-white rounded-xl shadow-lg transition ${
                loading || uploadingImage
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              }`}
            >
              {loading ? 'Đang gửi...' : uploadingImage ? 'Đang tải ảnh...' : 'GỬI CÔNG THỨC ĐI DUYỆT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
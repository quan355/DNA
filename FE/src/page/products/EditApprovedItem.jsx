// src/components/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: "", thumbnail_image: "", category: "", menuId: 1,
    instructions: [], ingredients: [],
    more: { prep_time: "", cook_time: "", serving_time: "", difficulty: "", source: "" }
  });

  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  const [currentStep, setCurrentStep] = useState("");
  const [ingName, setIngName] = useState("");
  const [ingQty, setIngQty] = useState("");

  // Load dữ liệu khi sửa
useEffect(() => {
  if (!isEdit) return;

  setLoading(true);
  axios.get(`http://localhost:5000/api/items/${id}`)
    .then(res => {
      const item = res.data;

      setFormData(prev => {
        if (prev.name) return prev; // ĐÃ CÓ DỮ LIỆU → GIỮ NGUYÊN (ảnh mới được bảo vệ!)
        return { ...prev, ...item, menuId: item.menuId || 1 };
      });

      setImagePreview(prev => prev || item.thumbnail_image);
    })
    .catch(() => {
      alert("Lỗi tải món ăn");
      navigate("/admin");
    })
    .finally(() => setLoading(false));
}, [id, isEdit, navigate]);

  // Upload ảnh từ máy
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  setImagePreview(previewUrl);
  setUploadingImage(true);

  const fd = new FormData();
  fd.append("image", file);

  try {
    const res = await axios.post("http://localhost:5000/api/upload", fd, {
      headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
    });

    const newUrl = res.data.imageUrl;

    // CẬP NHẬT CHẮC CHẮN BẰNG prev => ...
    setFormData(prev => ({ ...prev, thumbnail_image: newUrl }));
    setImagePreview(newUrl); // dùng URL thật luôn

    alert("Upload thành công! Ảnh đã được lưu vào form");
  } catch (err) {
    console.error(err);
    alert("Upload thất bại");
    setImagePreview(formData.thumbnail_image);
  } finally {
    setUploadingImage(false);
  }
};

  const handleLinkChange = (e) => {
  const url = e.target.value.trim();
  setFormData(prev => ({ ...prev, thumbnail_image: url }));
  setImagePreview(url); // ← đồng bộ luôn preview
};

  const addStep = () => { if (currentStep.trim()) { setFormData(p => ({...p, instructions: [...p.instructions, currentStep.trim()]})); setCurrentStep(""); }};
  const delStep = i => setFormData(p => ({...p, instructions: p.instructions.filter((_,x) => x !== i)}));

  const addIng = () => { if (ingName.trim() && ingQty.trim()) { setFormData(p => ({...p, ingredients: [...p.ingredients, {name: ingName.trim(), quantity: ingQty.trim()}]})); setIngName(""); setIngQty(""); }};
  const delIng = i => setFormData(p => ({...p, ingredients: p.ingredients.filter((_,x) => x !== i)}));

  const submit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.thumbnail_image || formData.instructions.length === 0 || formData.ingredients.length === 0) {
      return alert("Vui lòng điền đầy đủ!");
    }

    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/admin/items/${id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        alert("Cập nhật thành công!");
        navigate("/adminprod");
      } else {
        await axios.post("http://localhost:5000/api/waiting", formData, { headers: { Authorization: `Bearer ${token}` } });
        alert("Gửi công thức thành công!");
        navigate("/");
      }
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Thử lại"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-32 text-2xl">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold">{isEdit ? "CHỈNH SỬA MÓN ĂN" : "GỬI CÔNG THỨC MỚI"}</h1>
        </div>

        <form onSubmit={submit} className="p-8 space-y-10">

          {/* PHẦN ẢNH - NHỎ XINH NHƯ BẠN MUỐN */}
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-4 text-center">Ảnh bìa</label>

            {imagePreview && (
              <div className="mb-4">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow" />
              </div>
            )}

            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <div className={`px-6 py-3 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 font-medium ${uploadingImage ? 'opacity-70' : ''}`}>
                  {uploadingImage ? 'Đang tải lên...' : 'Chọn ảnh từ máy'}
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploadingImage} />
              </label>

              <input
                type="url"
                value={formData.thumbnail_image}
                onChange={handleLinkChange}
                placeholder="Dán link ảnh"
                className="flex-1 px-4 py-3 border rounded-lg text-sm"
              />
            </div>
          </div>

          {/* TÊN MÓN */}
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="Tên món ăn" className="w-full px-6 py-5 text-xl border-2 rounded-xl" required />

          {/* DANH MỤC + MENU ID */}
          <div className="grid md:grid-cols-2 gap-6">
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="px-6 py-5 border-2 rounded-xl text-lg" required>
              <option value="">Chọn danh mục</option>
              {["Breakfast","Lunch","Entrees","Dessert","Side","Drinks"].map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="number" min="1" max="6" value={formData.menuId} onChange={e => setFormData({...formData, menuId: +e.target.value})}
              placeholder="Menu ID (1-6)" className="px-6 py-5 border-2 rounded-xl text-lg" required />
          </div>

          {/* BƯỚC LÀM */}
          <div>
            <div className="flex gap-3 mb-4">
              <input value={currentStep} onChange={e => setCurrentStep(e.target.value)} onKeyPress={e => e.key==="Enter" && (e.preventDefault(), addStep())}
                placeholder="Nhập bước..." className="flex-1 px-6 py-5 border-2 rounded-xl" />
              <button type="button" onClick={addStep} className="px-8 py-5 bg-blue-600 text-white rounded-xl font-bold">Thêm</button>
            </div>
            {formData.instructions.map((s,i) => (
              <div key={i} className="flex justify-between bg-blue-50 p-4 rounded-xl mb-3">
                <span>Bước {i+1}: {s}</span>
                <button type="button" onClick={() => delStep(i)} className="text-red-600 font-bold">Xóa</button>
              </div>
            ))}
          </div>

          {/* NGUYÊN LIỆU */}
          <div>
            <div className="flex gap-3 mb-4">
              <input value={ingName} onChange={e => setIngName(e.target.value)} placeholder="Tên nguyên liệu" className="flex-1 px-6 py-5 border-2 rounded-xl" />
              <input value={ingQty} onChange={e => setIngQty(e.target.value)} placeholder="500g" className="w-40 px-6 py-5 border-2 rounded-xl" />
              <button type="button" onClick={addIng} className="px-8 py-5 bg-green-600 text-white rounded-xl font-bold">Thêm</button>
            </div>
            {formData.ingredients.map((g,i) => (
              <div key={i} className="flex justify-between bg-green-50 p-4 rounded-xl mb-3">
                <span>{g.name} — {g.quantity}</span>
                <button type="button" onClick={() => delIng(i)} className="text-red-600 font-bold">Xóa</button>
              </div>
            ))}
          </div>

          {/* THÔNG TIN BỔ SUNG */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <input value={formData.more.prep_time} onChange={e => setFormData({...formData, more:{...formData.more, prep_time: e.target.value}})} placeholder="Chuẩn bị" className="px-4 py-3 border rounded" required />
            <input value={formData.more.cook_time} onChange={e => setFormData({...formData, more:{...formData.more, cook_time: e.target.value}})} placeholder="Nấu" className="px-4 py-3 border rounded" required />
            <input value={formData.more.serving_time} onChange={e => setFormData({...formData, more:{...formData.more, serving_time: e.target.value}})} placeholder="Khẩu phần" className="px-4 py-3 border rounded" required />
            <select value={formData.more.difficulty} onChange={e => setFormData({...formData, more:{...formData.more, difficulty: e.target.value}})} className="px-4 py-3 border rounded" required>
              <option value="">Độ khó</option>
              <option>Dễ</option>
              <option>Trung bình</option>
              <option>Khó</option>
              <option>Siêu khó</option>
            </select>
            <input value={formData.more.source} onChange={e => setFormData({...formData, more:{...formData.more, source: e.target.value}})} placeholder="Nguồn (tuỳ chọn)" className="px-4 py-3 border rounded" />
          </div>

          <div className="text-center pt-10">
            <button type="submit" disabled={loading || uploadingImage}
              className="px-20 py-6 text-2xl font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-2xl disabled:opacity-70">
              {loading || uploadingImage ? "Đang xử lý..." : isEdit ? "LƯU THAY ĐỔI" : "GỬI ĐI DUYỆT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
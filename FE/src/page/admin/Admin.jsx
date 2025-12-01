import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiEdit3, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending'); // pending | approved | users | contact
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Phân trang
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const token = localStorage.getItem('token');

  // Fetch tất cả dữ liệu
  const fetchData = async () => {
    try {
      const [pRes, aRes, uRes, cRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/pending', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/admin/items', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/admin/users/all', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/admin/contact', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setPending(pRes.data.data || []);
      setApproved(aRes.data.data || []);
      setUsers(uRes.data.users || []);
      setContacts(cRes.data.contacts || []);
    } catch (err) {
      alert('Lỗi tải dữ liệu admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === PHÂN TRANG ===
  const paginate = (array, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return array.slice(start, start + ITEMS_PER_PAGE);
  };

  const totalPages = (array) => Math.ceil(array.length / ITEMS_PER_PAGE);

  // === XỬ LÝ DUYỆT / TỪ CHỐI / XÓA ===
  const approve = async (id) => {
    if (!window.confirm('DUYỆT công thức này?')) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert('Đã duyệt thành công!');
      fetchData();
    } catch (err) { alert('Lỗi duyệt'); }
  };

  const reject = async (id) => {
    if (!window.confirm('TỪ CHỐI và XÓA công thức này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/reject/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Đã từ chối!');
      fetchData();
    } catch (err) { alert('Lỗi từ chối'); }
  };

  const deleteApproved = async (id) => {
    if (!window.confirm('XÓA vĩnh viễn công thức này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Đã xóa!');
      fetchData();
    } catch (err) { alert('Lỗi xóa'); }
  };

  if (loading) return <div className="text-center py-20 text-xl">Đang tải dữ liệu admin...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Tabs giống ảnh của bạn */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="flex flex-wrap border-b">
            <button
              onClick={() => { setActiveTab('pending'); setCurrentPagePending(1); }}
              className={`px-8 py-4 font-semibold transition ${activeTab === 'pending' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              Công thức chờ duyệt ({pending.length})
            </button>
            <button
              onClick={() => { setActiveTab('approved'); setCurrentPageApproved(1); }}
              className={`px-8 py-4 font-semibold transition ${activeTab === 'approved' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              Công thức đã duyệt ({approved.length})
            </button>
          </div>
        </div>

        {/* NỘI DUNG THEO TAB */}
        {activeTab === 'pending' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Công thức chờ duyệt</h2>
            {pending.length === 0 ? (
              <p className="text-center py-20 text-gray-500 text-xl">Không có công thức nào chờ duyệt</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginate(pending, currentPagePending).map((item) => (
                    <div key={item._id} className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
                      <img src={item.thumbnail_image} alt={item.name} className="w-full h-48 object-cover" />
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-gray-600">Danh mục: {item.category}</p>
                        <div className="mt-4 flex gap-3">
                          <button onClick={() => approve(item._id)} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-medium">
                            Duyệt
                          </button>
                          <button onClick={() => reject(item._id)} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 font-medium">
                            Từ chối
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Phân trang */}
                {totalPages(pending) > 1 && (
                  <div className="flex justify-center gap-3 mt-10">
                    <button
                      onClick={() => setCurrentPagePending(p => Math.max(1, p - 1))}
                      disabled={currentPagePending === 1}
                      className="p-3 rounded-lg bg-white shadow hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FiChevronLeft />
                    </button>
                    <span className="py-3 px-5 bg-indigo-600 text-white rounded-lg font-medium">
                      Trang {currentPagePending} / {totalPages(pending)}
                    </span>
                    <button
                      onClick={() => setCurrentPagePending(p => Math.min(totalPages(pending), p + 1))}
                      disabled={currentPagePending === totalPages(pending)}
                      className="p-3 rounded-lg bg-white shadow hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'approved' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Công thức đã duyệt</h2>
            {approved.length === 0 ? (
              <p className="text-center py-20 text-gray-500 text-xl">Chưa có công thức nào được duyệt</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginate(approved, currentPageApproved).map((item) => (
                    <div key={item._id} className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
                      <img src={item.thumbnail_image} alt={item.name} className="w-full h-48 object-cover" />
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-gray-600">Danh mục: {item.category}</p>
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => navigate(`/admin/edit/${item._id}`)}  // ← THÊM DÒNG NÀY
                            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
                          >
                            <FiEdit3 /> Sửa
                          </button>
                          <button onClick={() => deleteApproved(item._id)} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-medium">
                            <FiTrash2 /> Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Phân trang */}
                {totalPages(approved) > 1 && (
                  <div className="flex justify-center gap-3 mt-10">
                    <button
                      onClick={() => setCurrentPageApproved(p => Math.max(1, p - 1))}
                      disabled={currentPageApproved === 1}
                      className="p-3 rounded-lg bg-white shadow hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FiChevronLeft />
                    </button>
                    <span className="py-3 px-5 bg-indigo-600 text-white rounded-lg font-medium">
                      Trang {currentPageApproved} / {totalPages(approved)}
                    </span>
                    <button
                      onClick={() => setCurrentPageApproved(p => Math.min(totalPages(approved), p + 1))}
                      disabled={currentPageApproved === totalPages(approved)}
                      className="p-3 rounded-lg bg-white shadow hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Bạn có thể thêm nội dung cho tab Users và Contact sau */}
      </div>
    </div>
  );
};

export default AdminDashboard;
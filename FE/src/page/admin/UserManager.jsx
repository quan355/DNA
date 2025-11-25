// src/pages/Admin/UsersManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Mail, Calendar, Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/admin';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await axios.get(`${API_BASE}/users/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.users || []);
      } else {
        const res = await axios.get(`${API_BASE}/contact`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContacts(res.data.contacts || []);
      }
    } catch (err) {
      alert('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Xóa vĩnh viễn người dùng này?')) return;
    try {
      await axios.delete(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== id));
      alert('Đã xóa thành công');
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  const filteredUsers = users.filter(u =>
    (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-8 py-5 font-bold text-lg transition ${activeTab === 'users' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'text-gray-500'}`}
            >
              Người dùng ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-8 py-5 font-bold text-lg transition ${activeTab === 'contacts' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'text-gray-500'}`}
            >
              Tin nhắn liên hệ ({contacts.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">Đang tải...</div>
        ) : activeTab === 'users' ? (
          <>
            <div className="p-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm tên, email, username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Người dùng</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profilePic || '/default-avatar.png'}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{user.fullName || user.username}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.email}</td>
                      
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-8 space-y-6">
            {contacts.length === 0 ? (
              <p className="text-center text-xl text-gray-500 py-12">Chưa có tin nhắn nào</p>
            ) : (
              contacts.map(contact => (
                <div key={contact._id} className="bg-gray-50 p-6 rounded-xl border">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-bold text-lg">{contact.name}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {contact.email}
                    </p>
                    {contact.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {contact.phone}
                      </p>
                    )}
                    <p className="mt-4 bg-white p-4 rounded-lg border">{contact.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
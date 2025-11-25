// src/pages/Contact.jsx (hoặc đường dẫn của bạn)
import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/contact', formData);
      
      setSuccess(res.data.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi thất bại, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="text-secondary px-6 lg:px-12 py-20 bg-gray-50 min-h-screen">
      <h1 className="text-center text-4xl pt-10 pb-4 font-bold text-secondary sm:text-6xl">
        Liên hệ với chúng tôi
      </h1>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">

          {/* Thông tin liên hệ */}
          <div className="md:py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in touch</h2>
            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              Bạn cần hỗ trợ? Có góp ý cho website? Hãy gửi tin nhắn cho chúng tôi, đội ngũ sẽ phản hồi trong vòng 24h!
            </p>

            <dl className="mt-10 space-y-6">
              <div className="flex gap-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium text-gray-800">+84 123 456 789</span>
              </div>
              <div className="flex gap-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-gray-800">support@nauan.com</span>
              </div>
              <div className="flex gap-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-gray-800">TP.HCM, Việt Nam</span>
              </div>
            </dl>
          </div>

          {/* Form gửi tin nhắn */}
          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border-2 border-[#9c702a] bg-white p-8 shadow-xl">
            {success && <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center font-medium">{success}</div>}
            {error && <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center font-medium">{error}</div>}

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">Họ tên</label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-300 focus:border-indigo-600 focus:outline-none transition text-gray-800"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-300 focus:border-indigo-600 focus:outline-none transition text-gray-800"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">Tin nhắn</label>
              <textarea
                name="message"
                required
                rows="6"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-300 focus:border-indigo-600 focus:outline-none transition text-gray-800 resize-none"
                placeholder="Viết góp ý, thắc mắc của bạn ở đây..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 px-8 text-xl font-bold text-white rounded-xl transition-all duration-300 
                ${loading 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#9c702a] to-indigo-700 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-2xl transform hover:scale-105'
                }`}
            >
              {loading ? 'Đang gửi...' : 'GỬI TIN NHẮN'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
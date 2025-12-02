import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoClock } from 'react-icons/go';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';

const Card = ({ item }) => {
  const [isSaved, setIsSaved] = useState(false);
  const token = localStorage.getItem('token');

  const categoryStyles = { 
    Entrees: {backgroundColor: '#f0f5c4', color: '#59871f'},
    Breakfast: {backgroundColor: '#efedfa', color: '#3c3a8f'},
    Lunch: {backgroundColor: '#e5f7f3', color: '#1f8787'},
    Desserts: {backgroundColor: '#e8f5fa', color: '#397a9e'},
    Sides: {backgroundColor: '#feefc9', color: '#d16400'},
    Drinks: {backgroundColor: '#ffeae3', color: '#f0493e'},
    default: {backgroundColor: '#fff', color: '#000'},
   };

  const getCategoryStyle = (category) => {
    return categoryStyles[category] || categoryStyles.default;
  };

  const categoryStyle = getCategoryStyle(item?.category);

  // Kiểm tra xem đã lưu chưa (nếu có token)
  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/user/saved', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const savedIds = res.data.data.map(r => r._id);
        setIsSaved(savedIds.includes(item._id));
      }).catch(() => {});
    }
  }, [item._id, token]);

  const handleSave = async () => {
    if (!token) {
      alert('Vui lòng đăng nhập để lưu công thức!');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/user/toggle/${item._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSaved(res.data.saved);
      alert(res.data.message);
    } catch (err) {
      alert('Lỗi khi lưu công thức');
    }
  };

  return (
    <div className='container mx-auto flex justify-center'>
      <div className='max-w-sm w-full'>
        <div className='bg-white relative shadow-lg hover:shadow-xl transition duration-500 rounded-lg h-full flex flex-col'>

          <img src={item?.thumbnail_image} alt="thumb" className='rounded-t-lg w-full object-cover h-48' />

          <div className='py-6 px-5 rounded-lg bg-white flex-1 flex flex-col justify-between'>
            <Link to={`/item/${item._id}`}>
              <h1 className='text-gray-700 font-bold text-2xl mb-8 hover:text-gray-900 line-clamp-2'>
                {item?.name}
              </h1>
            </Link>

            <div className='flex justify-between items-center'>
              <button style={{ backgroundColor: categoryStyle.backgroundColor, color: categoryStyle.color }}
                className='py-2 px-4 font-medium rounded-lg shadow-md'>
                {item?.category}
              </button>

              <div className='flex items-center gap-4'>
                <div className='flex items-center'>
                  <GoClock className='mr-1' />
                  <span>{item?.more?.prep_time}</span>
                </div>

                {/* TRÁI TIM LƯU */}
                <button onClick={handleSave} className='text-2xl transition hover:scale-110'>
                  {isSaved ? <FaHeart className='text-red-500' /> : <FaRegHeart className='text-gray-600' />}
                </button>
              </div>
            </div>
          </div>

          <div className='absolute top-2 right-2 py-2 px-4 bg-white rounded-lg shadow'>
            <span className='font-medium text-sm'>{item?.more?.difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
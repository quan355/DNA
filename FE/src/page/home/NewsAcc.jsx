import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RecipeCallToAction = () => {
  // Lấy user từ localStorage (hoặc bạn dùng context cũng được)
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  // Nếu đã đăng nhập → chuyển thẳng đến trang tạo món
  const handleClick = () => {
    if (user) {
      navigate('/create');
    }
  };

  return (
    <div className="w-full md:w-2/3 mx-auto flex flex-col items-center py-16 px-4">
      <h3 className="text-secondary font-semibold text-center text-4xl md:text-5xl">
        {user ? 'Tạo công thức mới ngay!' : 'Tham gia chia sẻ công thức cùng mọi người'}
      </h3>
      
      <p className="mt-6 text-gray-600 text-lg md:text-xl text-center leading-normal font-light max-w-3xl">
        Chia sẻ món ăn ngon, mẹo nấu ăn hay và kinh nghiệm bếp núc của bạn với hàng nghìn người cùng sở thích!
      </p>

      <div className="mt-10">
        {user ? (
          // Đã đăng nhập → hiện nút TẠO NGAY
          <Link to="/create">
            <button className="py-5 px-12 text-xl font-bold bg-btncolor text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              TẠO CÔNG THỨC MỚI
            </button>
          </Link>
        ) : (
          // Chưa đăng nhập → hiện nút ĐĂNG KÝ
          <Link to="/signup">
            <button className="py-5 px-12 text-xl font-bold text-secondary border-2 border-[#9c702a] rounded-xl hover:bg-btncolor hover:text-white hover:border-btncolor transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
              ĐĂNG KÝ NGAY
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default RecipeCallToAction;
import React from 'react';
import { FaUtensils, FaHeart, FaUsers, FaBook } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br bg-white">
      {/* Hero Section */}
      <section className="px-6 lg:px-12 py-20">
        <h1 className="text-center text-4xl pt-10 pb-6 font-bold text-secondary sm:text-6xl sm:leading-relaxed">
          Giới Thiệu
        </h1>
        <p className="text-center text-xl sm:w-2/3 mx-auto mb-12 text-gray-700 leading-relaxed">
          Nơi hội tụ hương vị Việt - Kết nối đam mê ẩm thực từ Bắc đến Nam
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="text-center mb-16">
            <FaUtensils className="text-6xl text-orange-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Chúng tôi xây dựng một cộng đồng ẩm thực Việt Nam, nơi mọi người có thể 
              khám phá, chia sẻ và học hỏi các công thức nấu ăn truyền thống và hiện đại 
              từ những đầu bếp tài năng khắp ba miền Tổ quốc.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl">
              <FaBook className="text-5xl text-orange-500 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gray-800 mb-2">100+</h3>
              <p className="text-lg text-gray-600">Công Thức Có Sẵn</p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <FaUsers className="text-5xl text-indigo-500 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gray-800 mb-2">50+</h3>
              <p className="text-lg text-gray-600">Đầu Bếp Đóng Góp</p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl">
              <FaHeart className="text-5xl text-red-500 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gray-800 mb-2">1000+</h3>
              <p className="text-lg text-gray-600">Người Yêu Thích</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Câu Chuyện Của Chúng Tôi
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Trang web của chúng tôi ra đời từ niềm đam mê với ẩm thực Việt Nam - 
              một nền ẩm thực phong phú, đa dạng và đầy màu sắc. Chúng tôi tin rằng 
              mỗi món ăn không chỉ là sự kết hợp của nguyên liệu, mà còn chứa đựng 
              câu chuyện, tâm huyết và văn hóa của từng vùng miền.
            </p>

            <p>
              Với hơn <span className="font-bold text-orange-600">100 công thức nấu ăn</span> được 
              tuyển chọn kỹ lưỡng từ các đầu bếp tài năng khắp Việt Nam, chúng tôi 
              mang đến cho bạn một kho tàng ẩm thực đích thực. Từ những món ăn dân dã 
              của miền Bắc, hương vị cay nồng đặc trưng của miền Trung, đến sự ngọt 
              thanh của ẩm thực miền Nam - tất cả đều có mặt tại đây.
            </p>

            <p>
              Mỗi công thức được các đầu bếp chúng tôi chia sẻ đều đi kèm với hướng dẫn 
              chi tiết, dễ hiểu, giúp bạn - dù là người mới bắt đầu hay đã có kinh nghiệm - 
              đều có thể tự tay tạo nên những món ăn ngon cho gia đình mình.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
            Giá Trị Cốt Lõi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border-l-4 border-orange-500 bg-orange-50 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                🌟 Chất Lượng Đảm Bảo
              </h3>
              <p className="text-gray-700">
                Mỗi công thức được kiểm chứng và thử nghiệm bởi các đầu bếp 
                chuyên nghiệp, đảm bảo độ chính xác và dễ thực hiện.
              </p>
            </div>

            <div className="p-6 border-l-4 border-indigo-500 bg-indigo-50 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                🤝 Cộng Đồng Kết Nối
              </h3>
              <p className="text-gray-700">
                Nơi những người yêu ẩm thực gặp gỡ, chia sẻ kinh nghiệm và 
                cùng nhau phát triển kỹ năng nấu nướng.
              </p>
            </div>

            <div className="p-6 border-l-4 border-green-500 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                📚 Học Hỏi Không Ngừng
              </h3>
              <p className="text-gray-700">
                Liên tục cập nhật công thức mới, tips nấu ăn và kiến thức 
                ẩm thực từ các chuyên gia hàng đầu.
              </p>
            </div>

            <div className="p-6 border-l-4 border-red-500 bg-red-50 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                ❤️ Gìn Giữ Văn Hóa
              </h3>
              <p className="text-gray-700">
                Lưu giữ và lan tỏa những công thức truyền thống, giúp thế hệ 
                trẻ hiểu và yêu quý ẩm thực Việt Nam hơn.
              </p>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default About;
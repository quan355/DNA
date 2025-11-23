require('dotenv').config();
const User = require('../model/accountModel');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendMail = require('../utils/sendMail');

// 1. QUÊN MẬT KHẨU - Gửi link reset
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống!' });
    }

    // Tạo token reset (an toàn, không đoán được)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Lưu token + thời hạn vào DB (hết hạn sau 15 phút)
    user.resetPasswordToken = resetToken;              
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Link đặt lại mật khẩu (frontend của bạn)
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Nội dung email
    await sendMail({
      email: user.email,
      subject: 'Đặt lại mật khẩu - DNA Kitchen (hết hạn sau 15 phút)',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Xin chào ${user.fullName || user.username}!</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn nút dưới đây để tiếp tục:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #4f46e5; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Đặt lại mật khẩu
            </a>
          </div>
          <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
          <small style="color: #888;">Link sẽ hết hạn sau 15 phút.</small>
        </div>
      `,
    });

    res.json({ message: 'Link đặt lại mật khẩu đã được gửi đến email!' });
  } catch (err) {
    console.error('Lỗi gửi email:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
  }
};

// 2. ĐẶT LẠI MẬT KHẨU MỚI
const resetPassword = async (req, res) => {
  let token = req.params.token;
  token = decodeURIComponent(token).replace(/ /g, '+').trim();

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Link không hợp lệ hoặc đã hết hạn!' });
    }

    user.password = req.body.password;  
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { forgotPassword, resetPassword };
const Account = require('../model/accountModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'bodoivl', {
    expiresIn: '1d',
  });
};

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập email và mật khẩu',
    });
  }

  try {
    // Tìm tài khoản theo email
    const account = await Account.findOne({ email }).select('+password');
    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      });
    }

    // So sánh mật khẩu
    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      });
    }

    // Tạo token
    const token = generateToken(account._id);

    // Trả về thông tin user (an toàn, không có password)
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: account._id,
        profilePic: account.profilePic,
        phone: account.phone || null,
        fullName: account.fullName,
        username: account.username,
        email: account.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ. Vui lòng thử lại sau.',
    });
  }
};

module.exports = { login };
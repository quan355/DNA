require('dotenv').config();
const Account = require('../model/accountModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res) => {
  const { fullName, username, email, password, phone } = req.body;

  // Kiểm tra thiếu trường
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập đầy đủ họ tên, username, email và mật khẩu',
    });
  }

  try {
    // Kiểm tra email hoặc username đã tồn tại
    const exists = await Account.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: exists.email === email ? 'Email đã được sử dụng' : 'Username đã tồn tại',
      });
    }

    // Tạo tài khoản mới
    const account = await Account.create({
      fullName,
      username,
      email: email.toLowerCase(),
      password,
      phone,
      profilePic, 
    });

    const token = generateToken(account._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: account._id,
        fullName: account.fullName,
        username: account.username,
        email: account.email,
        phone: account.phone,
        profilePic: account.profilePic,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại.',
    });
  }
};

module.exports = { register };
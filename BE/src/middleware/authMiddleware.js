// middleware/authMiddleware.js   ← file bạn đang require

const jwt = require('jsonwebtoken');
const User = require('../model/accountModel'); 

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Lấy token từ header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Không có token, truy cập bị từ chối!' });
    }

    // 2. Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Tìm user theo id trong token và gắn vào req
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    // 4. Gắn user vào request để dùng ở các route sau
    req.user = user;
    req.token = token; // (tùy chọn)

    next(); // cho qua để chạy controller
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

module.exports = authMiddleware;
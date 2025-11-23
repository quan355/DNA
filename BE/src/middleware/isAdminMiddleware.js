const isAdmin = (req, res, next) => {
  // Kiểm tra bằng ID admin cố định
  const ADMIN_ID = process.env.ADMIN_ID;
  if (req.user && req.user.id === ADMIN_ID) {
    return next();
  }

  return res.status(403).json({ 
    success: false, 
    message: 'Bạn không có quyền admin!' 
  });
};

module.exports = { isAdmin };
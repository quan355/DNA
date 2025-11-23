// src/controllers/uploadController.js
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Chưa chọn ảnh!' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: 'Upload thành công!',
    imageUrl
  });
};

module.exports = { uploadImage };
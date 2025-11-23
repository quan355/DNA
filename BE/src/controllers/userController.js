const User = require('../model/accountModel'); 
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { phone, profilePic, country, city, district } = req.body;
    // Kiểm tra phone trùng (nếu có thay đổi)
    if (phone && phone !== req.user.phone) {
      const existingPhone = await User.findOne({ phone, _id: { $ne: userId } });
      if (existingPhone) {
        return res.status(400).json({ message: 'Số điện thoại đã được sử dụng!' });
      }
    }
    // Cập nhật những field được phép
    const allowedUpdates = {
      ...(phone !== undefined && { phone }),
      ...(profilePic !== undefined && { profilePic }),
      ...(country !== undefined && { country }),
      ...(city !== undefined && { city }),
      ...(district !== undefined && { district })
    };
    if (Object.keys(allowedUpdates).length === 0) {
      return res.status(400).json({ message: 'Không có thông tin nào để cập nhật!' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');

    res.json({
      message: 'Cập nhật thông tin thành công!',
      user: updatedUser
    });

  } catch (err) {
    console.error('Lỗi cập nhật profile:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
  }
};

module.exports = { updateProfile };
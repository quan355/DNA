const User = require('../model/accountModel'); 
const Item = require('../model/ItemModel');
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
const toggleSaveRecipe = async (req, res) => {
  try {
    const userId = req.user.id; 
    const recipeId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User không tồn tại' });

    const recipe = await Item.findById(recipeId);
    if (!recipe) return res.status(404).json({ success: false, message: 'Công thức không tồn tại' });

    const isSaved = user.savedRecipes.includes(recipeId);

    if (isSaved) {
      user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
      await user.save();
      return res.json({ success: true, saved: false, message: 'Đã bỏ lưu' });
    } else {
      user.savedRecipes.push(recipeId);
      await user.save();
      return res.json({ success: true, saved: true, message: 'Đã lưu công thức!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách công thức đã lưu
const getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: 'savedRecipes',
      populate: { path: 'createdBy', select: 'fullName profilePic' }
    });

    res.json({ success: true, data: user.savedRecipes || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { updateProfile, toggleSaveRecipe, getSavedRecipes };
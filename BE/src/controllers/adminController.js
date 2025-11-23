const Item = require("../model/ItemModel");
const wItem = require("../model/waitItemsModel");

// LẤY DANH SÁCH CÔNG THỨC ĐANG CHỜ DUYỆT
const getPendingRecipes = async (req, res) => {
  try {
    const pending = await wItem.find({ status: 'pending' })
      .populate('createdBy', 'fullName email profilePic')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pending.length,
      data: pending
    });
  } catch (err) {
    console.error('Lỗi lấy danh sách chờ duyệt:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

//  XEM CHI TIẾT 1 CÔNG THỨC CHỜ DUYỆT
const getPendingRecipeDetail = async (req, res) => {
  try {
    const recipe = await wItem.findById(req.params.id)
      .populate('createdBy', 'fullName email profilePic');
    
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy công thức' });
    }
    
    res.json({ success: true, data: recipe });
  } catch (err) {
    console.error('Lỗi xem chi tiết:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

//  DUYỆT CÔNG THỨC
const approveRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const wRecipe = await wItem.findById(recipeId);

    if (!wRecipe) return res.status(404).json({ success: false, message: 'Không tìm thấy công thức' });
    if (wRecipe.status !== 'pending') return res.status(400).json({ success: false, message: 'Công thức đã xử lý' });

    // Copy sang bảng chính thức
    const approvedRecipe = new Item({
      ...wRecipe.toObject(),
      _id: undefined,
      approvedAt: new Date(),
      approvedBy: req.user.id
    });
    await approvedRecipe.save();

    // XÓA KHỎI BẢNG CHỜ
    await wItem.findByIdAndDelete(recipeId);

    res.json({
      success: true,
      message: 'Đã duyệt thành công! Công thức đã được đăng!',
      item: approvedRecipe
    });
  } catch (err) {
    console.error('Lỗi duyệt:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

//  TỪ CHỐI CÔNG THỨC
const rejectRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const wRecipe = await wItem.findById(recipeId);

    if (!wRecipe) return res.status(404).json({ success: false, message: 'Không tìm thấy công thức' });
    if (wRecipe.status !== 'pending') return res.status(400).json({ success: false, message: 'Công thức đã xử lý' });

    // XÓA HOÀN TOÀN
    await wItem.findByIdAndDelete(recipeId);

    res.json({
      success: true,
      message: 'Đã từ chối và xóa công thức khỏi danh sách chờ!'
    });
  } catch (err) {
    console.error('Lỗi từ chối:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  getPendingRecipes,
  getPendingRecipeDetail,
  approveRecipe,
  rejectRecipe
};
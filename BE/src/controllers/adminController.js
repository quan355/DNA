const Item = require("../model/ItemModel");
const wItem = require("../model/waitItemsModel");
const Contact = require('../model/contactModel');
const User = require('../model/accountModel');

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
// Lấy danh sách tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

//  Lấy tất cả tin nhắn liên hệ
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      contacts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
const getApprovedRecipes = async (req, res) => {
  try {
    const recipes = await Item.find()
      .populate('createdBy', 'fullName email profilePic')
      .sort({ approvedAt: -1 });

    res.json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (err) {
    console.error('Lỗi lấy danh sách công thức đã duyệt:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// XÓA CÔNG THỨC ĐÃ DUYỆT
const deleteApprovedRecipe = async (req, res) => {
  try {
    const recipe = await Item.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy công thức' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa công thức vĩnh viễn' });
  } catch (err) {
    console.error('Lỗi xóa công thức:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// CẬP NHẬT (SỬA) CÔNG THỨC ĐÃ DUYỆT
const updateApprovedRecipe = async (req, res) => {
  try {
    const { name, category, instructions, ingredients, more } = req.body;

    const recipe = await Item.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy công thức' });
    }

    // Cập nhật các field
    if (name) recipe.name = name;
    if (category) recipe.category = category;
    if (instructions) recipe.instructions = instructions;
    if (ingredients) recipe.ingredients = ingredients;
    if (more) recipe.more = more;

    await recipe.save();

    res.json({
      success: true,
      message: 'Cập nhật công thức thành công',
      data: recipe
    });
  } catch (err) {
    console.error('Lỗi sửa công thức:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
module.exports = {
  getPendingRecipes,
  getPendingRecipeDetail,
  approveRecipe,
  rejectRecipe,
  getAllUsers,
  deleteUser,
  getAllContacts,
  getApprovedRecipes,
  deleteApprovedRecipe,
  updateApprovedRecipe
};
const Item = require("../model/ItemModel");
// GET: Lấy tất cả món ăn
const getAllItems = async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.status(200).json(items);
};

// GET: Tìm kiếm món ăn theo tên
const getSearchedItems = async (req, res) => {
  const { q } = req.query;
  console.log(q);
  try {
    let items;
    if (q) {
      items = await Item.find({
        name: { $regex: q, $options: 'i' }
      });
    }
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'No Item Found!' });
  }
};
const getSingleItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Item not found!' });
  }
    
};
const getMenuIdByCategory = (category) => {
  if (category === "Entress") return 1;
  if (category === "Breakfast") return 2;
  if (category === "Lunch") return 3;
  if (category === "Desserts") return 4;
  if (category === "Sides") return 5;
  if (category === "Drinks") return 6;
  return null; // không hợp lệ
};
// Thêm sản phẩm mới
const addItem = async (req, res) => {
  try {
    const { name, thumbnail_image, category, instructions, tags, ingredients, comments, more, createdBy } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!name || !thumbnail_image || !category || !instructions || !createdBy ) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: name, thumbnail_image, category, instructions',
      });
    }
    const menuId = getMenuIdByCategory(category);
    if (!menuId) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục không hợp lệ',
      });
    }
    // Tạo sản phẩm mới
    const newItem = new Item({
      menuId,
      name,
      thumbnail_image,
      category,
      instructions,
      tags: tags || [],
      ingredients: ingredients || [],
      comments: comments || [],
      more: more || [],
      createdBy,
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm thành công!',
      item: newItem,
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm sản phẩm',
      error: error.message,
    });
  }
};

module.exports = { getAllItems, getSearchedItems, getSingleItem, addItem };
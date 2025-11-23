const Item = require("../model/ItemModel");
const wItem = require("../model/waitItemsModel");
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
// GET: Lấy tất cả món ăn do người dùng tạo
const getUserCreatedItems = async (req, res) => {
  const { q } = req.query;

  try {
    let items;

    if (q) {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(q);

      if (isObjectId) {
        items = await Item.find({ createdBy: q }).sort({ createdAt: -1 });
      } 
    } else {
      items = [];
    }

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
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
// Thêm sản phẩm mới vào bảng chờ duyệt
const addwItem = async (req, res) => {
  try {
    const { 
      name, 
      thumbnail_image, 
      category, 
      instructions, 
      tags, 
      ingredients, 
      more,          
      createdBy 
    } = req.body;

    // KIỂM TRA CÁC TRƯỜNG BẮT BUỘC (THÊM more)
    if (!name || !thumbnail_image || !category || !instructions || !more || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: name, thumbnail_image, category, instructions, more',
      });
    }
    const menuId = getMenuIdByCategory(category);
    if (!menuId) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục không hợp lệ',
      });
    }

    // TẠO SẢN PHẨM MỚI
    const newwItem = new wItem({
      menuId,
      name: name.trim(),
      thumbnail_image,
      category,
      instructions: instructions.trim(),
      tags: tags || [],
      ingredients,
      comments: [],        
      more,                
      createdBy,
      status: 'pending'    
    });

    await newwItem.save();

    res.status(201).json({
      success: true,
      message: 'Gửi công thức thành công! Đang chờ Admin duyệt...',
      item: newwItem,
    });

  } catch (error) {
    console.error('Add wItem error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm công thức',
      error: error.message,
    });
  }
};
module.exports = { getAllItems, getSearchedItems, getSingleItem, addwItem, getUserCreatedItems };
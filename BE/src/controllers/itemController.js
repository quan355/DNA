const Item = require("../model/ItemModel");
const wItem = require("../model/waitItemsModel");
// GET: Lấy tất cả món ăn
const getAllItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;   
    const skip = (page - 1) * limit;
    const total = await Item.countDocuments(); 

    const items = await Item.find({})           
      .sort({ createdAt: -1 })              
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Lỗi getAllItems:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi lấy danh sách món ăn' 
    });
  }
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
    res.status(500).json({ message: 'Không có công thức cần tìm!' });
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
    res.status(500).json({ message: 'Không có công thức cần tìm!' });
  }

};
const getMenuIdByCategory = (category) => {
  if (category === "Entress") return 1;
  if (category === "Breakfast") return 2;
  if (category === "Lunch") return 3;
  if (category === "Dessert") return 4;
  if (category === "Side") return 5;
  if (category === "Drinks") return 6;
  return null; // không hợp lệ
};
const addwItem = async (req, res) => {
  try {
    const { 
      name, 
      thumbnail_image, 
      category, 
      instructions, 
      ingredients = [], 
      tags = [], 
      more = {}, 
    } = req.body;

    // LẤY createdBy TỪ TOKEN (AN TOÀN NHẤT)
    const createdBy = req.user?._id;

    if (!createdBy) {
      return res.status(401).json({
        success: false,
        message: 'Không xác thực được người dùng!'
      });
    }

    // KIỂM TRA BẮT BUỘC – CHỈ CẦN CÁI THIẾT YẾU
    if (!name || !thumbnail_image || !category || !instructions || instructions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ: tên, ảnh, danh mục và ít nhất 1 bước làm!'
      });
    }

    const menuId = getMenuIdByCategory(category);
    if (!menuId) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục không hợp lệ!'
      });
    }

    // ĐẢM BẢO more LUÔN CÓ ĐỦ FIELD MẶC ĐỊNH
    const safeMore = {
      prep_time: more.prep_time || 'Chưa xác định',
      cook_time: more.cook_time || 'Chưa xác định',
      serving_time: more.serving_time || '1 người',
      difficulty: more.difficulty || 'Trung bình',
      source: more.source || 'Người dùng DayNauAn'
    };

    const newwItem = new wItem({
      menuId,
      name: name.trim(),
      thumbnail_image,
      category,
      instructions: Array.isArray(instructions) ? instructions : [instructions],
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      tags: Array.isArray(tags) ? tags : [],
      more: safeMore,
      createdBy,
      status: 'pending'
    });

    await newwItem.save();

    res.status(201).json({
      success: true,
      message: 'Gửi công thức thành công! Đang chờ duyệt...',
      item: newwItem
    });

  } catch (error) {
    console.error('Add wItem error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm công thức',
      error: error.message
    });
  }
};
module.exports = { getAllItems, getSearchedItems, getSingleItem, addwItem, getUserCreatedItems };
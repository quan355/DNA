// controllers/contactController.js
const Contact = require('../model/contactModel');

const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ sớm.',
      data: newContact
    });
  } catch (error) {
    console.error('Lỗi gửi contact:', error);
    res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau' });
  }
};

module.exports = { submitContact };
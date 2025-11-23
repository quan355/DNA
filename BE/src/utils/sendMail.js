// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Tạo transporter (dùng Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',                    // hoặc host: 's.gmail.mtpcom', port: 587, secure: false
    auth: {
      user: process.env.EMAIL_USER,      
      pass: process.env.EMAIL_PASS,   
    },
  });

  // 2. Cấu hình email
  const mailOptions = {
    from: `"DNA Kitchen" <${process.env.EMAIL_USER}>`,
    to: options.email,         
    subject: options.subject,  
    text: options.text,        
    html: options.html,        
  };

  // 3. Gửi email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const accountSchema = new Schema({
    profilePic: {
        type: String,
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
    },
    fullName : {
        type : String,
        required: true,
    },
    username : {
        type : String,
        unique: true,
        required: true,
    },
    password : {
        type : String,
        required: true,
    },
    email : {
        type : String,
        unique: true,
        required: true,
    },
    country: { type: String },
    city: { type: String},     
    district: { type: String},
    resetPasswordToken: String,          
    resetPasswordExpires: Date,
});
// Mã hóa password trước khi lưu
accountSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});// So sánh mật khẩu
accountSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const Login = mongoose.model("account", accountSchema);
module.exports = Login;
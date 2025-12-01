const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'account', required: true },
  userName: { type: String, required: true },
  userAvatar: { type:String },
  content: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // cho reply
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'account' }],
}, { timestamps: true });
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
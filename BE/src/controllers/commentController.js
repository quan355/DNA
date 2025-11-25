// controllers/commentController.js  ← DÙNG require + module.exports

const Comment = require('../model/commentModel');  // ← đổi thành require

// Helper: xây cây comment
const buildCommentTree = (comments) => {
  const map = {};
  const roots = [];

  comments.forEach(c => {
    c.replies = [];
    map[c._id] = c;
    if (!c.parentId) {
      roots.push(c);
    } else if (map[c.parentId]) {
      map[c.parentId].replies.push(c);
    }
  });

  return roots;
};

// GET /api/comments/:productId
const getCommentsByProduct = async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.productId })
      .sort({ createdAt: -1 })
      .lean();

    const tree = buildCommentTree(comments);
    res.json(tree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/comments/:productId
const createComment = async (req, res) => {
  const { content, parentId } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({ message: 'Nội dung không được để trống' });
  }

  try {
    const comment = new Comment({
      productId: req.params.productId,
      userId: req.user._id,
      userName: req.user.name || req.user.username,
      userAvatar: req.user.avatar || '',
      content: content.trim(),
      parentId: parentId || null,
    });

    const saved = await comment.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/comments/:commentId/like
const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const userIdStr = req.user._id.toString();
    const index = comment.likes.findIndex(id => id.toString() === userIdStr);

    if (index === -1) {
      comment.likes.push(req.user._id);
    } else {
      comment.likes.splice(index, 1);
    }

    await comment.save();

    res.json({
      likesCount: comment.likes.length,
      liked: index === -1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ← THAY TOÀN BỘ export thành module.exports
module.exports = {
  getCommentsByProduct,
  createComment,
  toggleLikeComment
};
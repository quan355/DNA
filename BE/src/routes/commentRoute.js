// src/routes/commentRoute.js  ← giữ nguyên tên file

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getCommentsByProduct,
  createComment,
  toggleLikeComment
} = require('../controllers/commentController');

// GET  /api/comments/:productId
router.get('/:productId', getCommentsByProduct);

// POST /api/comments/:productId
router.post('/:productId', authMiddleware, createComment);

// PATCH /api/comments/:commentId/like
router.patch('/:commentId/like', authMiddleware, toggleLikeComment);

module.exports = router;   // ← DÙNG module.exports = router (không dùng export default)
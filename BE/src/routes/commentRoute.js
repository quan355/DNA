// src/routes/commentRoute.js  ← giữ nguyên tên file

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getCommentsByProduct,
  createComment,
  toggleLikeComment
} = require('../controllers/commentController');

router.get('/:productId', getCommentsByProduct);
router.post('/:productId', authMiddleware, createComment);
router.patch('/:commentId/like', authMiddleware, toggleLikeComment);

module.exports = router;   
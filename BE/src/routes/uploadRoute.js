// src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // cái bạn đã có sẵn

// POST /api/upload
router.post('/upload', authMiddleware, upload, uploadImage);

module.exports = router;
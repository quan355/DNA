// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
router.put('/update', authMiddleware, updateProfile);

module.exports = router;
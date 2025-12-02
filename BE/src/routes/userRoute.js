// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { updateProfile, toggleSaveRecipe, getSavedRecipes } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
router.put('/update', authMiddleware, updateProfile);
router.post('/toggle/:id', authMiddleware, toggleSaveRecipe);
router.get('/saved', authMiddleware, getSavedRecipes);
module.exports = router;
// src/routes/menuRoutes.js

const express = require('express');
const router = express.Router();
const {
  addMenuItem,
  updateMenuItem,
  removeMenuItem,
} = require('../controllers/menuController');
const { protect, restaurantOwner } = require('../middleware/authMiddleware');

// Define routes
router.route('/:restaurantId/menu')
  .post(protect, restaurantOwner, addMenuItem);

router.route('/:restaurantId/menu/:itemId')
  .put(protect, restaurantOwner, updateMenuItem)
  .delete(protect, restaurantOwner, removeMenuItem);

module.exports = router;

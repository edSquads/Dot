// src/routes/restaurantRoutes.js

const express = require('express');
const router = express.Router();
const {
  createRestaurant,  // Check if this is correctly imported
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurantController');  // Ensure the import path and names are correct
const { protect, restaurantOwner } = require('../middleware/authMiddleware');

// Define routes
router.route('/')
  .get(getRestaurants)
  .post(protect, restaurantOwner, createRestaurant);  // This is likely where the error is

router.route('/:id')
  .get(getRestaurantById)
  .put(protect, restaurantOwner, updateRestaurant)
  .delete(protect, restaurantOwner, deleteRestaurant);

module.exports = router;

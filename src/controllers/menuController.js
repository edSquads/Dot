// src/controllers/menuController.js

const asyncHandler = require('express-async-handler');
const Menu = require('../models/Menu');
const Restaurant = require('../models/Restaurant');

// @desc    Add a new menu item
// @route   POST /api/restaurants/:restaurantId/menu
// @access  Private (Restaurant Owner)
const addMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;
  const restaurantId = req.params.restaurantId;

  // Ensure the restaurant exists and belongs to the logged-in user
  if (!name || !price) {
    res.status(400);
    throw new Error('Menu item name and price are required');
  }

  const restaurant = await Restaurant.findById(restaurantId);
  
  if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add menu items to this restaurant');
  }

  // Find or create the menu for the restaurant
  let menu = await Menu.findOne({ restaurant: restaurantId });

  if (!menu) {
    menu = new Menu({ restaurant: restaurantId, items: [] });
  }

  // Add the new menu item
  const newItem = { name, description, price };
  menu.items.push(newItem);
  await menu.save();

  res.status(201).json(menu);
});

// @desc    Update a menu item
// @route   PUT /api/restaurants/:restaurantId/menu/:itemId
// @access  Private (Restaurant Owner)
const updateMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;
  const { restaurantId, itemId } = req.params;

  // Ensure the restaurant exists and belongs to the logged-in user
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update menu items for this restaurant');
  }

  // Find the menu and the item to update
  const menu = await Menu.findOne({ restaurant: restaurantId });

  if (!menu) {
    res.status(404);
    throw new Error('Menu not found');
  }

  const item = menu.items.id(itemId);

  if (!item) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  // Update the menu item
  item.name = name || item.name;
  item.description = description || item.description;
  item.price = price || item.price;

  await menu.save();

  res.json(menu);
});

// @desc    Remove a menu item
// @route   DELETE /api/restaurants/:restaurantId/menu/:itemId
// @access  Private (Restaurant Owner)
const removeMenuItem = asyncHandler(async (req, res) => {
  const { restaurantId, itemId } = req.params;

  // Ensure the restaurant exists and belongs to the logged-in user
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete menu items from this restaurant');
  }

  // Find the menu and the item to remove
  const menu = await Menu.findOne({ restaurant: restaurantId });

  if (!menu) {
    res.status(404);
    throw new Error('Menu not found');
  }

  menu.items = menu.items.filter(item => item._id.toString() !== itemId);

  await menu.save();

  res.json({ message: 'Menu item removed' });
});

module.exports = {
  addMenuItem,
  updateMenuItem,
  removeMenuItem,
};

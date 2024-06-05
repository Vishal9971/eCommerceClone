const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const Router = express();

Router.get('/cart', async (req, res) => {
  let user = await User.findById(req.user._id).populate('cart');
  // const totalBill = user.cart.reduce((sum, curr) => sum + curr.price, 0);
  res.render('./cart/cart', { user});
});

Router.post('/cart/:id', async (req, res) => {
  let { id } = req.params;
  let userId = req.user._id;
  let foundProduct = await Product.findById(id);
  let user = await User.findById(userId);
  user.cart.push(foundProduct);
  await user.save();
  res.redirect('/cart');
});

module.exports = Router;

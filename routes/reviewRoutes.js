const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Router = express.Router();

Router.post('/products/:productId/review', async (req, res) => {
  let { rating, comment } = req.body;
  let { productId } = req.params;
  let foundProduct = await Product.findById(productId);
  let newReview = new Review({ rating, comment });
  await newReview.save();
  foundProduct.reviews.push(newReview);
  await foundProduct.save();
  req.flash('success', 'Review Added Successfully.');
  res.redirect(`/products`);
});

module.exports = Router;

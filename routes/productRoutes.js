const express = require('express');
const Product = require('../models/Product');
const { isLoggedIn, isSeller, isProductAuthor } = require('../middleware');
const Router = express.Router();
const multer = require('multer');
const Review = require('../models/Review');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

Router.get('/products', async (req, res) => {
  try {
    let allProducts = await Product.find({});
    res.render('products/index', { allProducts });
  } catch (e) {
    res.render('products/error', { err: e.message });
  }
});

Router.get('/products/new', isLoggedIn, isSeller, (req, res) => {
  try {
    res.render('products/new');
  } catch (e) {
    res.render('products/error', { err: e.message });
  }
});

Router.post('/products', upload.single('productImg'), async (req, res) => {
  try {
    let { name, des, price } = req.body;
    let img = req.file.filename;
    console.log(req.file);
    // console.log(name,des,price)
    await Product.create({ name, des, price, img, author: req.user._id });
    req.flash('success', 'Product Added Successfully.');
    res.redirect('/products');
  } catch (e) {
    res.render('products/error', { err: e.message });
  }
});

Router.get('/products/:id/show', async (req, res) => {
  try {
    let { id } = req.params;
    let foundProduct = await Product.findById(id).populate('reviews');
    // console.log(id);
    res.render('products/show', { foundProduct });
  } catch (e) {
    res.render('products/error', { err: e.message });
  }
});
Router.get('/products/:id/edit', isLoggedIn, isProductAuthor, async (req, res) => {
  try {
    let { id } = req.params;
    let foundProduct = await Product.findById(id);
    // console.log(id);
    res.render('products/edit', { foundProduct });
  } catch (e) {
    res.render('products/error', { err: e.message });
  }
});
Router.patch('/products/:id/edit', async (req, res) => {
  try {
    let { id } = req.params;
    let { name, img, price, des } = req.body;
    await Product.findByIdAndUpdate(id, { name, img, price, des });
    req.flash('success', 'Product Edited Successfully.');
    res.redirect('/products');
  } catch (e) {
    res.render('products/error', { err: e.message });
  }
});
Router.delete('/products/:id', isLoggedIn, isProductAuthor, async (req, res) => {
  try {
    let { id } = req.params;
    let product = await Product.findById(id);
    let img = product.img;
    var filePath = `C:/Users/Vishal Sharma/OneDrive/Desktop/E-commerce/public/uploads/${img}`;
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log('error occured : ', err);
      }
      console.log('sucessfully deleteModel');
    });
    for (let i of product.reviews) {
      await Review.findByIdAndDelete(i, {});
    }
    await Product.findByIdAndDelete(id, {});
    req.flash('success', 'Product Deleted Successfully.');
    res.redirect('/products');
  } catch (e) {
    res.render('products/error', { err: e.message });
  }
});

module.exports = Router;

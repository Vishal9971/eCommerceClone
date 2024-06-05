const express = require('express');
const User = require('../models/User');
const Router = express.Router();
const passport = require('passport');

Router.get('/signup', (req, res) => {
  res.render('user/signup');
});

Router.post('/signup', async (req, res) => {
  let { username, email, password, role } = req.body;
  let user = new User({ email, username, role });
  let newUser = await User.register(user, password);
  req.login(newUser, function (err) {
    if (err) {
      req.flash('error', 'Please Fill all details correct and then signup');
      return res.render('/signup');
    }
    req.flash('success', 'Welcome, You are successfully registered.');
    return res.redirect('/products');
  });
});

Router.get('/login', (req, res) => {
  res.render('user/login');
});

Router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
  req.flash('success', 'Welcome Back!!!');
  res.redirect('/products');
});

Router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success','Logged Out Successfully.')
    res.redirect('/login');
  });
});

module.exports = Router;

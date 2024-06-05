const Product = require('./models/Product');

const isLoggedIn = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      req.flash('error', 'Login First!!!');
      return res.redirect('/login');
    }
    next();
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/products');
  }
};

const isSeller = (req, res, next) => {
  try {
    if (!req.user.role) {
      req.flash('error', 'You are not Seller...');
      return res.redirect('/products');
    }
    if (req.user.role != 'seller') {
      req.flash('error', 'You are not Seller...');
      return res.redirect('/products');
    }
    next();
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/products');
  }
};

const isProductAuthor = async (req, res, next) => {
  try {
    let { id } = req.params;
    let foundProduct = await Product.findById(id);
    if (!foundProduct.author.equals(req.user._id)) {
      req.flash('error', 'Unauthorised Author!!!!');
      return res.redirect('/products');
    }
    next();
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/products');
  }
};

module.exports = { isSeller, isLoggedIn, isProductAuthor };

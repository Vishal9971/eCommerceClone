const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const seedDB = require('./seed');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/User');
const dbURL = process.env.dbURL ||'mongodb+srv://sharmavis77:w3pgR6l53cjRdfpH@cluster0.v48qojk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const configSession = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true },
  cookie: { httpOnly: true },
};
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');

// mongoose.set('strictQuery', true); //version 7 ki vajah se
mongoose
  .connect(dbURL)
  .then(() => {
    console.log('DB Connected');
  })
  .catch((e) => {
    console.log('error hai bhai', e);
  });


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session(configSession));
app.use(flash());

app.get('/', (req, res) => {
  res.redirect('/products');
});
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  // console.log(req.user);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
// seedDB();

app.use(productRoutes);

app.use(reviewRoutes);

app.use(authRoutes);

app.use(cartRoutes);

let PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log('server connected at PORT 8080');
});

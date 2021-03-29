var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('hbs');
const mongoose = require('mongoose');
var helpers = require('handlebars-helpers')();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/login');
};

// required router scripts
const aboutRouter = require('./routes/about');
const allCubesRouter = require('./routes/allCubes');
const attachAccessoryRouter = require('./routes/attachAccessory');
const cookieRouter = require('./routes/cookie');
const createAccessoryRouter = require('./routes/createAccessory');
const createRouter = require('./routes/create');
const deleteCubeRouter = require('./routes/deleteCube');
const detailsRouter = require('./routes/details');
const editCubeRouter = require('./routes/editCube');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const notFound404Router = require('./routes/404');
const registerRouter = require('./routes/register');
const searchRouter = require('./routes/search');

var app = express();

// hide sensitive info
require('dotenv').config();
mongoose.connect(process.env.DB_URI, {
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then((res) => console.log("Woohoo! DB Connected! Great job, Kev!"))
  .catch(err => console.error(err));

// Handlebars helper
//const { truncate } = require('./helpers/hbs');

  // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials("./views/partials");
hbs.registerHelper('getShortDescription', function(length, description) {
  if ( description.length > length ) {
   return description.substring(0, length) + "...";
  } else {
   return description;
  }
 });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// used to intialize passport session
app.use(require('express-session')({
  secret: process.env.EXP_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// need to separate protected routes and unprotected routes

// unprotected routes
app.use('/', indexRouter);
app.use('/search', searchRouter);
app.use('/about', aboutRouter);
app.use('/details', detailsRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/404', notFound404Router);


// protected routes
app.use(ensureAuthenticated);
app.use('/create', createRouter);
app.use('/createAccessory', createAccessoryRouter);
app.use('/attachAccessory', attachAccessoryRouter);
app.use('/allCubes', allCubesRouter);
app.use('/editCube', editCubeRouter);
app.use('/deleteCube', deleteCubeRouter);
app.use('/cookie', cookieRouter);
app.use('/logout', logoutRouter);

// passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // this will set locals and it will only provide error for development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the 404 page
  res.status(err.status || 500);
  res.render('404');
});

module.exports = app;
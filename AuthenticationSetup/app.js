const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStratagy = require('passport-local').Strategy;
const multer = require('multer');
const upload = multer({dest: './uploads'})
const flash = require('connect-flash');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const { check, validationResult } = require('express-validator');
const messages = require('express-messages');
const db = mongoose.connection;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//handle middlewares for morgan and body parser and cookie parser and serving static files
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle sessions meaning just genrating a session for thhe user

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));


// Passport  initializing passport and giving it the session we previously created 

app.use(passport.initialize());
app.use(passport.session());


//express messages and express flash setup  

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// using the routes we created errlier 

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

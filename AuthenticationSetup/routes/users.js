const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'})
const passport = require('passport');
const LocalStratagy = require('passport-local').Strategy;
const e = require('express');
const { check,validationResult, body } = require('express-validator');
const User = require('../models/user');

/* GET users listing. */
router.get('/register', function(req, res, next) {
  let flashSuccess = req.flash('success')
  res.render('signup',{ title: 'Register' ,
  expressFlashSuccess: flashSuccess });
});

router.get('/login', function(req, res, next) {


  let expressFlash = req.flash('success');
  let FailexpressFlash = req.flash('error');

  // if statment to pass in a express flash success variable if there is any messaages or just render the page normally 
  if(expressFlash != undefined){
    console.log('Success flash', expressFlash)
   res.render('login', { title: 'Login' ,  expressFlashSuccess: expressFlash });
  }else if(FailexpressFlash != undefined){
    console.log('Faiilure flash ', FailexpressFlash)
    res.render('login',{ title: 'Login', expressFlashFailure: FailexpressFlash });

  }else{
    res.render('login',{ title: 'Login'});
  }



});

// setting up route with authentication 


router.post('/login',
  passport.authenticate('local',{failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
    req.flash('success','you are now logged in');
    res.redirect('/');
  });
 
 
  // serialzing and deserializing the user
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

// setting up local stratagy 

passport.use(new LocalStratagy(function(username,password, done){
  User.getUserByUsername(username,function(err,user){
    if(err) throw err;
    if(!user){
      return done(null,false,{message: 'Unkown User'});
    }
    User.comparePassword(password, user.password, function(err,isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null,user);
      }else{
        return done(null,false, {message: 'Invalid Password'});
      }
    })
  })
}))

router.post('/register', upload.single('profilepic'),[
  check('username').notEmpty().withMessage('Username is requierd'),
  check('email','Please use a valid email')
  .notEmpty().withMessage('Email is requierd')
  .isEmail().withMessage('Use a valid email'),
  check('password')
  .notEmpty().withMessage('Password is requierd'),
  check('confirmPassword')
  .notEmpty().withMessage('Retype the password Requierd')
  // Custom password field validation with password field 
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    // Indicates the success of this synchronous custom validator
    console.log('password matched')
    return true;})

], function(req, res, next) {
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    res.render('signup',{  
      title: 'Register',
      ValidationErrors: errors.errors
    })
  }else{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const profilepic = req.file.filename;

    const newUser = new User({
      email: email,
      username: username,
      password: password,
      profilepic: profilepic
    });

    User.createUser(newUser, function(err,user){
      if(err) throw err;
      console.log(user);

      req.flash('success', 'Welcome to node auth');
      res.location('/');
      res.redirect('/');
    });
}
});

router.post('/login', function(req, res, next) {
  res.render('login',{ title: 'Login' });
});


module.exports = router;

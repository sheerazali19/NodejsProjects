const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/users');
const bcrypt = require('bcryptjs'); 
const passport = require('passport');

// Get Routes 
router.get('/login', (req, res) =>  {
    res.render('login', { title: 'Login' } )
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' } )
});


// Post Routes 
router.post('/register',[
    check('username')
    .notEmpty()
    .withMessage('Name is requierd')
    .custom(async (username) => { 
        const existingUser =  
            await User.findOne({ username:username }) 
              
        if (existingUser) { 
            throw new Error('Username already exist') 
        } 
    }),
    check('email','Please use a valid email')
    .notEmpty()
    .withMessage('Email is requierd')
    .isEmail()
    .withMessage('Use a valid email')
    // Custom Validation to see if user already exists 
    .custom(async (email) => { 
        const existingUser =  
            await User.findOne({ email:email }) 
              
        if (existingUser) { 
            throw new Error('Email already in use') 
        } 
    }),
    check('password')
    .notEmpty().withMessage('Password is requierd')
    .isLength({ min: 4 }).withMessage('Password must be atleast 4 words long'),
    check('password2')
    .notEmpty().withMessage('Retype the password Requierd')
    // Custom password field validation with password field 
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      // Indicates the success of this synchronous custom validator
      console.log('password matched')
      return true;})
    ], (req,res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      res.render('register',{  
        title: 'Register',
        ValidationErrors: errors.errors
      });

    }else{
    const { username, email, password} = req.body;

    const newUser = new User({
        email: email,
        username: username,
        password: password
    });

// Bcrypt  to hash the password

    bcrypt.genSalt(10, function(err, salt) {
// Genrating Hash 
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // If error than show it 
            if (err) throw err 

            // Or set the hash to NewUser objects password value
            newUser.password = hash;
            console.log(newUser);
        
            // saving user to database with the password value as hash  

            newUser.save()

            // above returns a promise so now redirecting user to the login page from here
            .then(user => {
                // Getting and passing flash message with redirect and passing a success_msg flag for displaying this message we will need to change stuff in message.ejs partial 
                req.flash('success_msg','You are now registerd and can login');
                res.redirect('/users/login');
            })
            .catch(err => console.log(err));
        });
    });

    }
})

// Login Post Request

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { 
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true })(req, res, next); 

});

router.get('/logout',(req, res, next) => {
    console.log('this hits the logout')
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
})
        
module.exports = router;


// <% if (success_msg  !== '' ){ %>
//     <div class="alert alert-success" role="alert">
//         <%= success_msg %>
//       </div>
//   <% } %>
  
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose'); 
const { connect } = require('http2');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
app.use(morgan('dev'));

// Passport config 

require('./config/passport')(passport);

// DB config

const db = require('./config/keys').MongoURI;

// Body Parser

app.use(express.urlencoded({extended: false}));

// Express session 

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))

// Passport middleware Must be put after the express session middle ware and bw flash 

app.use(passport.initialize());
app.use(passport.session());

// Connect Flash 
app.use(flash());

console.log('problem here')
// Global Variables for flash messages in a custom middleware

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    // Another global variable for passport errors
    res.locals.error = req.flash('error');

    next();
});

// Connect to Mongo

mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('MongoDB Connected ...'))
.catch(err => console.log(err));

// EJS

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Routes 

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;




app.listen(PORT, console.log(`Server started on port ${PORT}`));
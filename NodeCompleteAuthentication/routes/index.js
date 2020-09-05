const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
    res.render('welcome', { title: 'Welcome' });

});


router.get('/dashboard', ensureAuthenticated , (req, res) => {
    console.log(req.user);
    res.render('dashboard', { title: 'Dashboard' , name: req.user.name } );
});


module.exports = router;
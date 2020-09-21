const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../config/auth');
const Post = require('../models/posts');
const User = require('../models/users');
const { paginatedResults } = require('../config/resuableFunctions');

router.get('/', (req, res) => {
    Post.find({})
    .sort({date: -1})
    .then(function(posts) {
      let postsObject = paginatedResults(req,posts);
        res.render('welcome', { title: 'Welcome' , posts: postsObject.results , paginationObject: postsObject});
    })
    .catch(function(err) {
      res.json(err);
    });
});


router.get('/dashboard', ensureAuthenticated , (req, res) => {
 
  User.findOne({ username: req.user.username })
  // ..and populate all of the notes associated with it
  .populate({path: 'posts', options: { sort: { 'date': -1 } } })

  .then((posts) => {
    let postsObject = paginatedResults(req,posts.posts);
    res.render('dashboard', { title: 'Dashboard', posts: postsObject.results , paginationObject: postsObject});
  
  })
  .catch((err) => {
    // If an error occurred, send it to the client
    res.render('dashboard', { title: 'Dashboard' });
    console.log(err);
  });
});


module.exports = router;

// 9425004496

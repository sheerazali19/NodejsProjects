const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Post = require('../models/posts');
const multer = require('multer');
var crypto = require("crypto");
const Comment = require('../models/comments');


// const coverImageFolder = multer({dest: './blogCoverPic'})
// setting up multer storage for more control of sending and saving with extention

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './blogCoverPic')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    let filename = crypto.randomBytes(20).toString('hex');
    cb(null, filename + '.' +extension)
  }
});
const coverImageFolder = multer({ storage: storage })


const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/users');

// Get Routes 

router.get('/add', ensureAuthenticated ,(req, res) =>  {
    res.render('addPost',{title: 'Add post'});
});

// Show single post at /blog/postid
router.get('/:postid' ,(req, res) =>  {
  // Finding one post from id given and then sending in individual page 
  Post.findOne({ _id: req.params.postid })
  .populate('comments')
  .then((post) => {
    res.render('singlePost',{title: post.title , post: post , comments: post.comments});
  })
  .catch((err) => {
    console.log(err)
  });
});


// Post Routes 

router.post('/', ensureAuthenticated , coverImageFolder.single('coverPic'),[
    check('title')
    .notEmpty()
    .withMessage('Title is requierd'),
    
    check('postBody')
    .notEmpty()
    .withMessage('Please enter a post in the post box'),
    
    // Custom Validation to see if user already exists     
    // check('author')
    // .notEmpty().withMessage('Author name is requierd')
  ] ,  
    
    (req,res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      res.render('addPost',{  
        title: 'Add Post',
        ValidationErrors: errors.errors
      });

    }else{
    const { title, postBody} = req.body;
    const coverpic = req.file.filename;
    const newPost = new Post({
      title: title,
      postBody: postBody,
      author: req.user.username,
      coverImage: coverpic
    });
    console.log(newPost)

    Post.create(newPost)
    .then((post) => {
      return User.findOneAndUpdate({ username : req.user.username }, {$push: {posts: post._id }}, { new: true });
    })
    .then((post) => {
         User.find({ username : req.user.username } )
        .then((foundUser) => {
          console.log(foundUser);
        });
    });

    req.flash('success_msg','Post is public now');
    res.redirect('/');

    }
});



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// COMMENT ROUTES
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/:postid/comment/add', ensureAuthenticated ,[
  check('commentBody')
  .notEmpty()
  .withMessage('comment not specified'),
] ,  
  (req,res) => {

  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    
    res.render('newcomment',{  
      title: 'New Comment',
      ValidationErrors: errors.errors,
      postParamId: req.params.postid
    });

  }else{
    const { commentBody } = req.body;
    const newComment = new Comment({
      commentBody: commentBody,
      author: req.user.username,
    });
    console.log(newComment)
    Comment.create(newComment)
    .then((comment) => {
      return Post.findOneAndUpdate({ _id : req.params.postid }, {$push: {comments: comment._id }}, { new: true });
    })

    // finds that post with post id
    // .then((comment) => {
    //      Post.find({ _id : req.params.postid } )
    //     .then((foundPost) => {
    //       console.log(foundPost);
    //     });
    //});
    
    req.flash('success_msg','Comment is submitted');

    res.redirect('/blog/' + req.params.postid);
  
    }
});

        
module.exports = router;

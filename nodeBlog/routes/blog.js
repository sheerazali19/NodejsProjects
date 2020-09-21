const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Post = require("../models/posts");
const multer = require("multer");
var crypto = require("crypto");
const Comment = require("../models/comments");
const axios = require("axios");

// const coverImageFolder = multer({dest: './blogCoverPic'})
// setting up multer storage for more control of sending and saving with extention

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./blogCoverPic");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    let filename = crypto.randomBytes(20).toString("hex");
    cb(null, filename + "." + extension);
  },
});
const coverImageFolder = multer({ storage: storage });

const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/users");

// Get Routes

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("addPost", { title: "Add post" });
});

// Show single post at /blog/postid
router.get("/:postid", (req, res) => {
  // Finding one post from id given and then sending in individual page
  Post.findOne({ _id: req.params.postid })
    .populate("comments")
    .then((post) => {
      res.render("singlePost", {
        title: post.title,
        post: post,
        comments: post.comments,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Post Routes

router.post(
  "/",
  ensureAuthenticated,
  coverImageFolder.single("coverPic"),
  [
    check("title").notEmpty().withMessage("Title is requierd"),

    check("postBody")
      .notEmpty()
      .withMessage("Please enter a post in the post box"),
  ],

  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("addPost", {
        title: "Add Post",
        ValidationErrors: errors.errors,
      });
    } else {
      const { title, postBody } = req.body;
      const coverpic = typeof(req.file) != 'undefined' ? req.file.filename : 'placeholder.png';
      const newPost = new Post({
        title: title,
        postBody: postBody,
        author: req.user.username,
        coverImage: coverpic,
      });
      console.log(newPost);

      Post.create(newPost)
        .then((post) => {
          return User.findOneAndUpdate(
            { username: req.user.username },
            { $push: { posts: post._id } },
            { new: true }
          );
        })
        .then((post) => {
          User.find({ username: req.user.username }).then((foundUser) => {
            console.log(foundUser);
          });
        });

      req.flash("success_msg", "Post is public now");
      res.redirect("/");
    }
  }
);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// COMMENT ROUTES
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post(
  "/:postid/comment/add",
  ensureAuthenticated,
  [check("commentBody").notEmpty().withMessage("comment not specified")],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("newcomment", {
        title: "New Comment",
        ValidationErrors: errors.errors,
        postParamId: req.params.postid,
      });
    } else {
      const { commentBody } = req.body;
      const newComment = new Comment({
        commentBody: commentBody,
        author: req.user.username,
      });
      console.log(newComment);
      Comment.create(newComment).then((comment) => {
        return Post.findOneAndUpdate(
          { _id: req.params.postid },
          { $push: { comments: comment._id } },
          { new: true }
        );
      });

      req.flash("success_msg", "Comment is submitted");

      res.redirect("/blog/" + req.params.postid);
    }
  }
);

// Get Routes

router.get("/:postid/:commentid/comment/edit", ensureAuthenticated, (req, res) => {
  res.render("editComment", { title: "Edit Comment", postId: req.params.postid , commentId: req.params.commentid });
});


router.post("/:postid/:commentid/comment/edit", ensureAuthenticated, [ check("commentBody").notEmpty().withMessage("comment not specified") ] , ( req, res ) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("editComment" , {  title: "Edit Comment", ValidationErrors: errors.errors, postId: req.params.postid, commentId: req.params.commentid } )
  } else {
    Comment.findOne({ _id : req.params.commentid } )
    .then((comment) => { 
      console.log(comment)
      console.log("comment auther and req user" , comment.author , "  <=    => " ,req.user.username)
      if (comment.author == req.user.username) {

        Comment.findOneAndUpdate({ _id: req.params.commentid },{ commentBody: req.body.commentBody })
        .then((comment) => { 
                console.log(comment); 
                req.flash("success_msg", "Comment was updated"); 
                res.redirect("/blog/" + req.params.postid); })
      }
        else {
          req.flash("error_msg", "You are not allowed to perform this action");
          res.redirect("/blog/" + req.params.postid)
        }
    })
  }
});



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  Edit Blog Routes
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Get Routes

// Edit Post Get handler

router.get("/:postid/edit", ensureAuthenticated, (req, res) => {
  console.error("hit the edit get rooute now");
  Post.findOne({ _id: req.params.postid }).then((post) => {
    if (post.author == req.user.username) {
      res.render("editPost", { title: "Edit post", post: post });
    } else {
      req.flash("error_msg", "You can only edit your own posts");
      res.redirect("/dashboard");
    }
  });
});

//  Post Routes

// Edit Post post handler

router.post(
  "/:postid/edit",
  ensureAuthenticated,
  coverImageFolder.single("coverPic"),
  [
    check("title").notEmpty().withMessage("Title is requierd"),
    check("postBody")
      .notEmpty()
      .withMessage("Please enter a post in the post box"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("there was an error");
      res.render("editPost", {
        title: "Edit Post",
        ValidationErrors: errors.errors,
      });
    } else {
      const { title, postBody } = req.body;
      const coverpic = req.file.filename;
      const UpdatedPost = {
        title: title,
        postBody: postBody,
        coverImage: coverpic,
      };
      Post.findOne({ _id: req.params.postid }).then((post) => {
        console.log(
          "these are the username and post auther",
          "post auther",
          post.author,
          "user username",
          req.user.username
        );
        if (post.author == req.user.username) {
          let endPoint =
            req.protocol +
            "://" +
            req.get("host") +
            "/images/coverpic/delete/" +
            post.coverImage;
          axios.delete(endPoint);
          Post.findOneAndUpdate(
            { _id: req.params.postid },
            {
              title: UpdatedPost.title,
              postBody: UpdatedPost.postBody,
              coverImage: UpdatedPost.coverImage,
            }
          ).then((post) => {
            console.log(post);
          });

          req.flash("success_msg", "Post was updated");
          res.redirect("/dashboard");
        } // IF block ends here
        else {
          req.flash("error_msg", "You are not allowed to perform this action");
          res.redirect("/dashboard");
          console.log("You are not allowed to perferm this action");
        } // Else block ends here
      });
    }
  }
);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  Delete Blog Routes
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Delete Blog post

router.delete("/:postid/delete", ensureAuthenticated, (req, res) => {
  Post.findOne({ _id: req.params.postid }).then((post) => {
    if (post.author == req.user.username) {
      // Deleting image
      let endPoint =
        req.protocol +
        "://" +
        req.get("host") +
        "/images/coverpic/delete/" +
        post.coverImage;
      axios.delete(endPoint);

      Post.findByIdAndRemove(req.params.postid).then((post) => {
        req.flash("success_msg", "Post Deleted Successfully");
        res.redirect("/dashboard");
      });
    } else {
      req.flash("error_msg", "You can only delete your own posts");
      res.redirect("/dashboard");
    }
  });
});

// Delete comment post

router.delete(
  "/:postid/:commentid/comment/delete",
  ensureAuthenticated,
  (req, res) => {
    Comment.findOne({ _id: req.params.commentid }).then((comment) => {
      if (comment.author == req.user.username) {
        Comment.findByIdAndRemove(req.params.commentid).then((post) => {
          req.flash("success_msg", "Comment Deleted Successfully");
          res.redirect("/blog/" + req.params.postid);
        });
      } else {
        req.flash("error_msg", "You can only delete your own comments");
        res.redirect("/blog/" + req.params.postid);
      }
    });
  }
);

module.exports = router;

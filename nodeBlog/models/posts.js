const mongoose = require('mongoose');
const Comment = require('../models/comments');

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        requierd: true
    },
    postBody: {
        type: String,
        requierd: true
    },  
    coverImage: {
        type: String,
    },
    catagory:{
        type: String,
    },
    author:{
        type: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }
});

const Post =  mongoose.model('Post', PostSchema);

module.exports = Post;
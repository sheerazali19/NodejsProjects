const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    author: {
        type: String,
        requierd: true
    },
    commentBody: {
        type: String,
        requierd: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const Comment =  mongoose.model('Comment', CommentSchema);

module.exports = Comment;
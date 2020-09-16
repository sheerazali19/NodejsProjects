const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const Post = require('../models/posts');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        requierd: true
    },
    email:{
        type:String,
        requierd: true
    },
    password: {
        type:String,
        requierd: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
});

const User =  mongoose.model('User', UserSchema);

module.exports = User;

module.exports.getUser = function(email) {
    const query = { email: email }
    return User
      .findOne(query)
      .then(user => {
        return user
      })
      .catch(err => {
        throw (err);
      })
  };
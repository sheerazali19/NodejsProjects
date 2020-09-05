const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const UserSchema = mongoose.Schema({
    name: {
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
    }
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
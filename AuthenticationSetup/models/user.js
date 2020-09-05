const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

mongoose.connect('mongodb://root:brocode1@ds135726.mlab.com:35726/nodeauth');

const db = mongoose.connection;

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type:String
    },
    email:{
        type:String
    },
    name:{
        type: String
    },
    profilepic:{
        type:String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);


module.exports.getUserById = function(id,callback){
    User.findById(id,callbacks);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query,callback);
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        callback(null,isMatch);
    });
}


module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs'); 

// Load user model

const User = require('../models/users');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: "username"}, (username, password, done) => {

            // Checking if the user even exists in database
            User.findOne({username: username})
            .then(user => {
                if(!user){
                    // Done callback with null as the error and false for the user object beacuse there is no user and than options which is our message
                    return done(null, false, {message: 'That username is not registerd'});
                }

                // Match the password
                // Password that came from form and user.password is hash in our db  than a call back which have and err and a isMatch which is a boolean 
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    // If there is a error show it
                    if(err) throw err;
                    // If there is a isMatch than send in the user object
                    if(isMatch){
                        return done(null, user);
                    }else // If there is a isMatch than send in false for user and a message                     
                    {
                        done(null, false, {message: "Password is incorrect"})
                    }
                })
            })
            .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}
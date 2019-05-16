const LocalStrategy = require('passport-local').Strategy;
const Notary = require('../models/notary');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport2){
  // Local Strategy
  passport2.use(new LocalStrategy(function(notusername, password, done){
    // Match Username
    let query = {notusername:notusername};
    Notary.findOne(query, function(err, notuser){
      if(err) throw err;
      if(!notuser){
        return done(null, false, {message: 'No notary found'});
      }

      // Match Password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, notuser);
        } else {
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));

  passport2.serializeUser(function(notuser, done) {
    done(null, notuser.id);
  });

  passport2.deserializeUser(function(id, done) {
    Notary.findById(id, function(err, notuser) {
      done(err, notuser);
    });
  });
}

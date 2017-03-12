const FbStrategy     = require('passport-facebook').Strategy;
const LocalStrategy  = require('passport-local').Strategy;
const User           = require('../models/user');
const bcrypt         = require("bcrypt");

module.exports = function(passport){
  passport.use(new LocalStrategy({
    passReqToCallback : true
  },(req, username, password, next) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }
      return next(null, user);
    });
  }));

  passport.use(new FbStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ username: profile.displayName }, function(err, user) {
        if(err) {
          console.log(err);
        }
        if (!err && user !== null) {
          done(null, user);
        } else {
          console.log(profile);
          let [name, familyName] = profile.displayName.split(" ");
          user = new User({
            name, familyName,
            username: profile.displayName,
            role: 'Student'
          });
          user.save(function(err) {
            if(err) {
              console.log(err);  // handle errors!
            } else {
              console.log("saving user ...");
              done(null, user);
            }
          });
        }
      });
    }
  ));
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    User.findOne({ "_id": id }, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });
}

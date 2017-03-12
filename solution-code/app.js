/*jshint esversion: 6 */
const express           = require('express');
const path              = require('path');
const favicon           = require('serve-favicon');
const logger            = require('morgan');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const flash             = require("connect-flash");
const User              = require('./models/user');
const Course            = require('./models/course');
const CourseUser        = require('./models/course-user');
const bcrypt            = require('bcrypt');
const authController    = require("./routes/authController");
const siteController    = require("./routes/siteController");
const coursesController = require("./routes/coursesController");
const session           = require("express-session");
const expressLayouts    = require("express-ejs-layouts");
const passport          = require("passport");
const LocalStrategy     = require("passport-local").Strategy;
const FbStrategy        = require('passport-facebook').Strategy;
const mongoose          = require("mongoose");
const moment            = require("moment");
const {loggedIn}          = require('./middleware/user-roles-auth')
mongoose.connect("mongodb://localhost/ibi-ironhack");
require("dotenv").config();

var app = express();
app.use(flash());
app.locals.moment = moment
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set("layout", "layouts/main-layout");
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "passport-local-strategy",
  resave: true,
  saveUninitialized: true
}));
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

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

app.use(passport.initialize());
app.use(passport.session());
app.use('/',loggedIn);

app.use('/', authController);
app.use('/', siteController);
app.use('/courses', coursesController);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

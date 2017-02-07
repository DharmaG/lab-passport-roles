/*jshint esversion: 6 */
const express = require('express');
const authController = express.Router();
// Models
const User = require('../models/user');
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

function checkIfStaff(role){
  console.log('jdsjhfdhjdf');
  return ((role === "Boss") || (role === "Developer") || (role === "TA"));
}

function ensureEmployee(req, res, next){
  console.log(req.user.username);
    if (req.isAuthenticated() && checkIfStaff(req.user.role) ) {
      console.log('guarra');
      return next();
    } else {
      res.redirect('/login');
    }
}
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
}
const checkBoss = checkRoles('Boss');
const checkTA = checkRoles('TA');
const checkDev = checkRoles('Developer');

authController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username, role,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "The username already exists" });
      } else {
        res.redirect("/login");
      }
    });
  });
});

authController.get('/login', (req, res, next) => {
  res.render('auth/login', {"message": req.flash('error')});
});
authController.post("/login", passport.authenticate("local", {
  // console.log
  successRedirect: "/users",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authController.get('/private', ensureLogin.ensureLoggedIn(), (req, res) =>{
  res.render('private', {user: req.user});
});

authController.get('/some-private', ensureAuthenticated, (req, res)=>{
  res.render('some-private', {user: req.user});
});
authController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


// Handle backup of the IBI
authController.get('/backup', checkBoss, (req, res) =>{
  res.render('backup', {user: req.user });
});

authController.post('/backup', checkBoss,(req, res)=>{
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "" || role === "") {
    res.render("backup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("backup", { message: "The username already exists" });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username, role,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("backup", { message: "The username already exists" });
      } else {
        res.redirect("/users");
      }
    });
  });
});

authController.get('/users', ensureAuthenticated, (req, res, next)=>{
  User.find({role: {$not: {$eq: 'Boss'}}
  }, (err, users)=>{
    if (err){ return next(err);}
    res.render('users', {users, currentUser: req.user});
  });
});

authController.post('/users/:userId/delete', checkBoss, (req, res, next) =>{
  User.remove({ _id: req.params.userId }, function(err) {
      if (!err) {
        res.redirect('/users');
      }
      else {
        message.type = 'error';
      }
  });
});

authController.get('/profile', ensureAuthenticated, (req, res, next) => {
  res.render('profile', {user: req.user});
});


authController.get("/auth/facebook", passport.authenticate("facebook"));
authController.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/profile",
  failureRedirect: "/"
}));


module.exports = authController;

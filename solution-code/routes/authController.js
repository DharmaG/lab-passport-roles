const express                = require('express');
const authController         = express.Router();
// Models
const User                   = require('../models/user');
const Course                 = require('../models/course')
const bcrypt                 = require("bcrypt");
const bcryptSalt             = 10;
const passport               = require('passport');
const ensureLogin            = require('connect-ensure-login');
const { checkRoles,
  ensureEmployee,
  checkIfStaff,
        ensureAuthenticated } = require('../middleware/user-roles-auth');

const checkBoss = checkRoles('Boss');
const checkTA = checkRoles('Teacher Assistant');
const checkDev = checkRoles('Developer');


authController.post("/login", passport.authenticate("local", {
  successRedirect: "/users",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));


authController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Handle admin of the IBI
authController.get('/admin', checkBoss, (req, res) =>{
  res.render('auth/admin', {user: req.user });
});

authController.post('/users', checkBoss,(req, res)=>{
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const familyName = req.body.familyname;
  const name = req.body.name;
  const city = req.body.city
// ############################################################
  if (username === "" || password === "" || role === "" || city === "") {
    res.render("auth/admin", { message: "Indicate username, password, city and role" });
    return;
  }
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/admin", { message: "The username already exists" });
      return;
    }
    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);
    var newUser  = User({
      username, role, name, familyName, city,
      password: hashPass
    });
    newUser.save((err) => {
      if (err) {
        res.render("auth/admin", { message: "The username already exists" });
      } else {
        res.redirect("/users");
      }
    });
  });
});

authController.get('/users', ensureEmployee, (req, res, next)=>{
  User.find({role: {$not: {$eq: 'Boss'}}
  }, (err, users)=>{
    if (err){ return next(err);}
    res.render('auth/users', {users, currentUser: req.user});
  });
});

authController.post('/users/:userId/delete', checkBoss, (req, res, next) =>{
  User.remove({ _id: req.params.userId },(err) =>{
      if (!err) {
        res.redirect('/users');
      } else {
        message.type = 'error';
      }
  });
});

authController.get("/auth/facebook", passport.authenticate("facebook"));
authController.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/courses",
  failureRedirect: "/"
}));


module.exports = authController;

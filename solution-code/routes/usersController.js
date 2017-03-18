const express           = require("express");
const usersController   = express.Router();
const User              = require("../models/user");
const { ensureEmployee,
        checkRoles }     = require("../middleware/user-roles-auth");
const checkBoss         = checkRoles('Boss');


usersController.get('/', ensureEmployee, (req, res, next)=>{
  User.find({role: {$not: {$eq: 'Boss'}}
  }, (err, users)=>{
    if (err){ return next(err);}
    res.render('auth/users', {users, currentUser: req.user});
  });
});

usersController.post('/', checkBoss,(req, res)=>{
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const familyName = req.body.familyname;
  const name = req.body.name;
  const city = req.body.city
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

usersController.post('/:user_id/delete', checkBoss, (req, res, next) =>{
  User.remove({ _id: req.params.user_id },(err) =>{
      if (!err) {
        res.redirect('/users');
      } else {
        message.type = 'error';
      }
  });
});

module.exports = usersController;

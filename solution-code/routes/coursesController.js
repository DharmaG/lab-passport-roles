const express                             = require('express');
const coursesController                      = express.Router();
// Models
const User                                = require('../models/user');
const Course                              = require('../models/course')
const { checkRoles, ensureAuthenticated } = require('../middleware/user-roles-auth');
const checkTA = checkRoles("Teacher Assistant");

coursesController.get("/", ensureAuthenticated, (req, res, next) =>{
  Course.find((err, courses) =>{
    if (err){ return next(err) }
    res.render("courses/index", {courses, user: req.user});
  })
});

coursesController.get("/new", checkTA, (req, res, next)=>{
    res.render("courses/new")
});

coursesController.post("/", checkTA, (req, res, next)=>{
  const { name, startingDate ,endDate, level, available } = req.body
  if (name === "" || startingDate === "" || endDate === "" || level === "" || available === "" ){
    res.render("courses/new", {message: "Please fill in all the fields"})
    return
  }
  Course.findOne({name, startingDate, endDate}, (err, course) => {
    if (course !== null) {
      res.render("courses/new",
        { message: "This course with this parameters already exists" });
      return;
    }
  })
  const newCourse = new Course({name, startingDate ,endDate, level, available })
  newCourse.save((err)=>{
    if (err){
      res.render("courses/new", {message: "Something went wrong"});
    } else{
      res.redirect("/courses");
    }
  })
})

coursesController.post("/:course_id/delete", checkTA, (req, res, next)=>{
  const id = req.params.course_id
  Course.remove({_id: id}, (err) => {
    if (!err) {
      res.redirect('/courses');
    } else {
      message.type = 'error';
    }
  });
});

coursesController.get("/:course_id", checkTA, (req, res, next)=>{
  const id = req.params.course_id;
  Course.findById(id, (err, course)=>{
    if(err) return next(err);
    res.render("courses/show",{user: req.user, course})
  })
});

module.exports = coursesController;

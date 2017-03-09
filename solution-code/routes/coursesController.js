const express           = require('express');
const coursesController = express.Router();
// Models
const User              = require('../models/user');
const Course            = require('../models/course')
const CourseUser        = require('../models/course-user');
const { checkRoles,
  ensureAuthenticated } = require('../middleware/user-roles-auth');
const checkTA           = checkRoles("Teacher Assistant");

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
  Course.findById(id,(err, course) => {
    if (err) return next(err);
    if (!course){
      res.send("No course with this critteria")
      return
    }
    course.remove((err)=>{
      if (err) return next(err)
      res.redirect('/courses');
    })
  })
});

coursesController.get("/:course_id", checkTA, (req, res, next)=>{
  const id = req.params.course_id;
  Course.findById(id, (err, course)=>{
    if (err) return next(err);
    if (!course){
      res.send("no courses found");
      return;
    }
    course.getEnrolledStudents((err, students)=>{
      course.getAvailableStudents((err, available)=>{
        res.render("courses/show",{currentUser: req.user, course, students, available})
        })
      })
  })
});
coursesController.post("/:course_id/add-student", checkTA, (req, res, next)=>{
  let courseId = req.params.course_id;
  let studentId = req.body.student_id;
  CourseUser.create({courseId, userId: studentId},(err, result)=>{
    if (err) {
      res.render("courses/show", {message: "Something went wrong"})
      return
    }
    res.redirect(`/courses/${courseId}`)
  })
})

module.exports = coursesController;

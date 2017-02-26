const express                             = require('express');
const courseController                      = express.Router();
// Models
const User                                = require('../models/user');
const Course                              = require('../models/course')
const { checkRoles, ensureAuthenticated } = require('../middleware/user-roles-auth');

courseController.get("/", ensureAuthenticated, (req, res, next) =>{
  Course.find((err, courses) =>{
    if (err){ return next(err) }
    res.render('courses/index', {courses, user: req.user});
  })
})

module.exports = courseController;

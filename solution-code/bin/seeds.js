// const mongoose       = require('mongoose');
// const bcrypt         = require("bcrypt");
// const bcryptSalt     = 10;
// const User           = require('../models/user');
// const Course         = require('../models/course');
// const CourseUser     = require('../models/course-user');
// var salt             = bcrypt.genSaltSync(bcryptSalt);
// const password       = "ironhack";
// var encryptedPass    = bcrypt.hashSync(password, salt);
// mongoose.connect("mongodb://localhost/ibi-ironhack");
//
// const boss = new User({
//   username: 'theboss',
//   name: 'Gonzalo',
//   familyName: 'M.',
//   password: encryptedPass,
//   role: 'Boss'
// });
// const courses = [
//   {
//     name: 'Introduction to Ruby on Rails',
//     startingDate: new Date('2017-03-01'),
//     endDate: new Date('2017-04-01'),
//     level: 'Beginner',
//     available: true
//   },
//   {
//     name: 'Ruby on Rails Advanced',
//     startingDate: new Date('2017-02-01'),
//     endDate: new Date('2017-03-27'),
//     level: 'Advanced',
//     available: true
//   },
//   {
//     name: 'Angular 2',
//     startingDate: new Date('2017-04-15'),
//     endDate: new Date('2017-06-30'),
//     level: 'Advanced',
//     available: true
//   },
//   {
//     name: 'MongoDB',
//     startingDate: new Date('2017-04-04'),
//     endDate: new Date('2017-05-04'),
//     level: 'Advanced',
//     available: true
//   },
//   {
//     name: 'Express Introduction',
//     startingDate: new Date('2017-03-01'),
//     endDate: new Date('2017-04-01'),
//     level: 'Beginner',
//     available: true
//   },
// ];
//
//
// // ===========================================================================
// // Add this to check if students can be added to courses
// const students = [
//   {
//     username: 'jv',
//     name: 'Juan',
//     familyName: 'V',
//     password: encryptedPass,
//     role: 'Student'
//   },
//   {
//     username: 'ah',
//     name: 'Alfonso',
//     familyName: 'H',
//     password: encryptedPass,
//     role: 'Student'
//   },
//   {
//     username: 'la',
//     name: 'Aluis',
//     familyName: 'A',
//     password: encryptedPass,
//     role: 'Student'
//   }
// ]
//
// User.create(students,(err, students)=>{
//   if (err) throw err;
//   students.forEach(student => console.log(student.name))
// })
//
// User.create(boss, (err, user) => {
//   if (err) {
//     throw err;
//   }
//   console.log("User saved on database", user);
// });
//
// Course.create(courses, (err, docs)=>{
//   if (err) { throw err };
//   console.log("Courses saved on database");
//     docs.forEach( (course) => {
//       console.log(course.name);
//     })
//     mongoose.connection.close();
// });

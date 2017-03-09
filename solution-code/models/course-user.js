const User     = require('./user');
const Course   = require('./course');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const courseUsersSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true},
  userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  })

const CourseUsers = mongoose.model("CoursesUsers", courseUsersSchema);
module.exports = CourseUsers;

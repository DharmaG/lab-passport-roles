const mongoose     = require("mongoose");
const Schema       = mongoose.Schema;
const CoursesUsers = require("./course-user");
const User         = require("./user");

const courseSchema = new Schema({
  name: String,
  startingDate: Date,
  endDate: Date,
  available: Boolean,
  level: {
    type: String,
    enum: ['Beginner', 'Advanced'],
    default: 'Beginner'
  }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

courseSchema.pre("save", function(next){
  console.log("saved");
  next()
})

courseSchema.pre("remove", function(next){
  CoursesUsers.remove({courseId: this._id})
    .then(()=>next())
})


// Possible students
courseSchema.methods.getAvailableStudents = function(cb){
  return CoursesUsers.find({courseId: this._id})
  .exec((err, relations)=>{
    let ids = relations.map(rel => rel.userId)
    User.find({$and: [{_id: {$not: {$in: ids}}}, {role: "Student"}]}).exec(cb)
    })
  }

//enrolled students
courseSchema.methods.getEnrolledStudents = function(cb){
  return CoursesUsers.find({courseId: this._id})
  .exec((err, relations)=>{
    let ids = relations.map(rel => rel.userId)
    User.find({_id: {$in: ids}}).exec(cb)
    })
}
const Course = mongoose.model("Course", courseSchema);
module.exports = Course;

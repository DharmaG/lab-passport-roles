const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  name: String,
  familyName: String,
  city: {type: String, default: "Madrid"},
  role: {
    type: String,
    enum: ['Boss', 'Developer', 'Teacher Assistant', 'Student'],
    default: 'Student'
  }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
// name: String, familyName: String, city: String

const mongoose = require('mongoose');
const User = require('./user');

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  skype: String,
  teacherID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  email: String,
  Monday: String,
  Tuesday: String,
  Wednesday: String,
  Thursday: String,
  Friday: String,
  Saturday: String,
  Sunday: String,
});

module.exports = mongoose.model('Student', studentSchema);

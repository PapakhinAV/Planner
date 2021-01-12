const mongoose = require('mongoose');
const User = require('./user');
const Student = require('./student');

const LessonPlanScema = mongoose.Schema({
  theme: {
    type: String,
    required: true,
  },
  creatDate: Date,
  date: {
    type: String,
    required: true,
  },
  planValue:
  {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  teacherID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('LessonPlan', LessonPlanScema);

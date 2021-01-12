const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Student = require('../models/student');
const LessonPlan = require('../models/lessonPlan');
const { checkAuth } = require('../middleweare/auth');

const router = express.Router();
router.get('/new/:id', (req, res) => {
  const { id } = req.params;
  res.render('student/newStudent', { id });
});

router.post('/saveNew', async (req, res) => {
  const {
    name, phone, skype, email, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday,
  } = req.body;
  const teacherID = res.locals.id;
  const newStudent = new Student({
    teacherID, name, email, phone, skype, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday,
  });
  await newStudent.save();
  res.redirect(`/home/${res.locals.id}`);
});

router.delete('/deleteStudent', async (req, res) => {
  const id = req.body.articleID;
  try {
    await LessonPlan.deleteMany({ studentId: id });
    await Student.findOneAndDelete({ _id: id });
    return res.sendStatus(200);
  } catch (error) {
    res.send('Ошибка удаления!');
  }
});
router.delete('/deletePlan', async (req, res) => {
  const id = req.body.articleID;
  try {
    await LessonPlan.findOneAndDelete({ _id: id });
    return res.sendStatus(200);
  } catch (error) {
    res.send('Ошибка удаления!');
  }
});
router.get('/newPlan', async (req, res) => {
  const allStudents = await Student.find({ teacherID: req.session.user.id });
  res.render('student/newPlan', { allStudents });
});

router.post('/newPlan', async (req, res) => {
  const teacherID = res.locals.id;
  const {
    studentId, theme, date, planValue,
  } = req.body;
  const creatDate = date;
  const plan = new LessonPlan({
    theme,
    date,
    planValue,
    studentId,
    teacherID,
    creatDate,
  });
  await plan.save();
  res.redirect(`/student/${teacherID}/${studentId}`);
});
//
router.get('/update/:id', async (req, res) => {
  const planID = req.params.id;
  const latestPlan = await LessonPlan.findOne({ _id: planID });
  const student = latestPlan.studentId;
  const studentInfo = await Student.findOne({ _id: student });
  if (!studentInfo) { return res.redirect('/'); }
  const students = await Student.find();
  const lessonPlans = await LessonPlan.find({ studentId: student });
  lessonPlans.sort((a, b) => b.creatDate - a.creatDate);
  res.render('student/studentPage', {
    students, studentInfo, lessonPlans, latestPlan,
  });
});

router.post('/editPlan/:id', async (req, res) => {
  const { id } = req.params;
  const { theme, date, planValue } = req.body;
  const plan = await LessonPlan.findOne({ _id: id });
  // console.log(plan);
  plan.theme = theme;
  plan.date = date;
  plan.creatDate = date;
  plan.planValue = planValue;
  await plan.save();
  const { teacherID } = plan;
  const { studentId } = plan;
  res.redirect(`/student/${teacherID}/${studentId}`);
});

router.post('/editStudent/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name, email, phone, skype, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday,
  } = req.body;
  const stud = await Student.findOne({ _id: id });

  stud.name = name,
    stud.email = email,
    stud.phone = phone,
    stud.skype = skype,
    stud.Monday = Monday,
    stud.Tuesday = Tuesday,
    stud.Wednesday = Wednesday,
    stud.Thursday = Thursday,
    stud.Friday = Friday,
    stud.Saturday = Saturday,
    stud.Sunday = Sunday,
    await stud.save();
  const { teacherID } = stud;
  res.redirect(`/student/${teacherID}/${id}`);
});

router.get('/:tutor/:id', async (req, res) => {
  const student = req.params.id;
  const studentInfo = await Student.findOne({ _id: student });
  if (!studentInfo) { res.redirect('/'); }
  const students = await Student.find();
  const lessonPlans = await LessonPlan.find({ studentId: student });
  const latestPlan = lessonPlans[0];
  lessonPlans.sort((a, b) => b.creatDate - a.creatDate);
  res.render('student/studentPage', {
    students, studentInfo, lessonPlans, latestPlan,
  });
});

module.exports = router;

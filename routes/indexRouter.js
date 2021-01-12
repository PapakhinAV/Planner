const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Student = require('../models/student');
const LessonPlan = require('../models/lessonPlan');
const { checkAuth } = require('../middleweare/auth');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session?.user?.id) {
    return res.redirect(`/home/${req.session.user.id}`);
  }
  return res.render('registration/index');
});

router.get('/registration', (req, res) => {
  if (req.session?.user?.id) {
    return res.redirect(`/home/${req.session.user.id}`);
  }
  res.render('registration/registration');
});

router.get('/signIn', (req, res) => {
  if (req.session?.user?.id) {
    return res.redirect(`/home/${req.session.user.id}`);
  }
  res.render('registration/signIn');
});

router.get('/home/:id', checkAuth, async (req, res) => {
  const students = await Student.find({ teacherID: req.session.user.id });
  res.render('home', { students });
});

router.get('/signout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return res.render('error', { error: err });
    res.clearCookie('sid');
    res.redirect('/');
  });
});
router.get('/profile/:id', checkAuth, async (req, res, next) => {
  const { id } = req.session.user;
  const currentUser = await User.findOne({ _id: id });
  res.render('profile', { currentUser, id });
});

router.post('/registration', async (req, res) => {
  const { email, password, name } = req.body;
  if (email && password) {
    try {
      const pass = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: pass, name });
      await newUser.save();
      req.session.user = {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      };
      return res.redirect(`/home/${newUser._id}`);
    } catch (error) {
      return res.render('error', { error });
    }
  } else { res.send('Заполните все поля!'); }
});

router.post('/signIn', async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    try {
      const currentUser = await User.findOne({ email });
      if (await bcrypt.compare(password, currentUser.password)) {
        req.session.user = {
          id: currentUser._id,
          email: currentUser.email,
          name: currentUser.name,
        };
        return res.redirect(`/home/${currentUser._id}`);
      } res.send('Не верные логин или пароль!');
    } catch (error) {
      return res.render('error', { error });
    }
  } else { res.send('Заполните все поля!'); }
});

router.post('/profile/:id', checkAuth, async (req, res, next) => {
  const { name, email } = req.body;
  if (email && name) {
    try {
      const currentUser = await User.findOne({ _id: req.params.id });
      if (req.body.password) {
        const pass = await bcrypt.hash(req.body.password, 10);
        currentUser.password = pass;
      }
      currentUser.email = email;
      currentUser.name = name;
      await currentUser.save();
      res.redirect(`/home/${req.params.id}`);
    } catch (error) {
      res.send('Ошибка ввода!', error);
    }
  }
});

module.exports = router;

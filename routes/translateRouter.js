global.fetch = require('node-fetch');
const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../models/user');
const Student = require('../models/student');
const LessonPlan = require('../models/lessonPlan');
const { checkAuth } = require('../middleweare/auth');

const router = express.Router();
const key = process.env.KEY;

router.post('/', async (req, res) => {
  let {
    targetLanguageCode, textsBefor, textsAfter,
  } = req.body;
  const students = await Student.find({ teacherID: req.session.user.id });
  if (textsBefor) {
    const text = [textsBefor];
    const response = await fetch('https://translate.api.cloud.yandex.net/translate/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        folder_id: process.env.ID,
        texts: text,
        targetLanguageCode,
      }),
    });
    const result = await response.json();
    textsAfter = result.translations[0].text;
    return res.render('home', { students, textsAfter, textsBefor });
  } return res.render('home', { students });
});

module.exports = router;

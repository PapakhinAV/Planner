const User = require('../models/user');
const Student = require('../models/student');

const checkAuth = async (req, res, next) => {
  const userId = req.session?.user?.id;
  if (userId === req.params.id) {
    const user = await User.findById(userId);
    if (user) {
      return next();
    }
    return res.status(401).render('error', { message: 'Пройдите авторизацию!' });
  }
  return res.status(401).render('error', { message: 'Пройдите авторизацию!' });
};

module.exports = {
  checkAuth,
};

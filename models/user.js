const mongoose = require('mongoose');

const userScema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userScema);

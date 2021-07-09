const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required '],
  },
  email: {
    type: String,
    required: [true, 'Email id is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid Email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    requird: [true, 'password is required'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirm your password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    requird: [true, 'Please provide password'],
    minlength: 8,
    selected: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      //this only works on save
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not same',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

userSchema.methods.passwordCorrect = async function (
  typedPassword,
  dbPassword
) {
  return await bcrypt.compare(typedPassword, dbPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

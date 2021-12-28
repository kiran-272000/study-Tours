const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.Signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //1) checking email and password provided by the user
  const { email, password } = req.body; // destructured

  // const email = req.body.email;
  // const password = req.body.password

  if (!email || !password) {
    return next(new AppError('Enter email id and password', 400));
  }

  //2) verifying the email and password
  const user = await User.findOne({ email }).select('+password');
  // const correct = user.passwordCorrect(password, user.password);

  if (!user || !(await user.passwordCorrect(password, user.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }

  //3) generating token
  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) chencking if the token is sent as a header

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);

  if (!token) {
    return next(new AppError('please login to access', 401));
  }

  //2) verifying the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //3) check if the user still exist
  // const freshUser = await
  //4) check if the user changed the password after inssuing the token

  next();
});

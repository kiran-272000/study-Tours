const express = require('express');
//const userControllers = require('./../controllers/userControllers');
const authController = require('../controllers/authController');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser,
} = require('../controllers/userControllers');

const Router = express.Router();

Router.post('/signup', authController.Signup);
Router.post('/login', authController.login);

Router.route('/')
  //.get(userControllers.getAllUsers)
  //.post(userControllers.addUser);
  .get(getAllUsers)
  .post(addUser);
Router.route('/:id')
  //   .get(userControllers.getUser)
  //   .patch(userControllers.updateUser)
  //   .delete(userControllers.deleteUser);
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);
module.exports = Router;

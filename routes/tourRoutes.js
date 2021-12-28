const express = require('express');

const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authController');

const Router = express.Router();
Router.route('/top-5-tours').get(
  tourController.alaiseTopTour,
  tourController.getAllTour
);
Router.route('/getTourStat').get(tourController.getTourStat);
Router.route('/getMonthlyPlan/:year').get(tourController.getMonthlyPlan);
// Router.param('id', tourController.checkId);
// Router.use(req,res,next)
Router.route('/')
  .get(authController.protect, tourController.getAllTour)
  .post(tourController.addTour);
Router.route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = Router;

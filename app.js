/* eslint-disable prettier/prettier */
const express = require('express');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControlers');
const tourRouter = require('./routes/tourRoutes');

const userRouter = require(`./routes/userRoutes`);

const app = express();

// 1) Middlewares
//app.use(morgan('dev'));

app.use(express.json());

// app.use((req, res, next) => {
//   console.log('hello midle ware');
//   next();
// });
// app.use((req, res, next) => {
//   req.requesTime = new Date().toISOString();
//   next();
// });

// app.get('/api/v1/tours', getAllTour);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', addTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3) Routes
console.log(process.env.NODE_ENV);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: `Cannot find ${req.originalUrl} in this server`,
  //   });
  //////////////////////////////////////////////////////////////////////////////////

  //   const err = new Error(`Cannot find ${req.originalUrl} in this server`);
  //   err.status = 'fail';
  //   err.statusCode = 404;
  //   next(err);
  next(new AppError(`Cannot find ${req.originalUrl} in this server`, 404));
});

app.use(globalErrorHandler);
//4) starting server
module.exports = app;

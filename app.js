/* eslint-disable prettier/prettier */
const express = require('express');
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

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//4) starting server
module.exports = app;

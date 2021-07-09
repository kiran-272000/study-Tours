const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('db connection sucessfull');
  });

// const testTour = new Tour({
//   name: 'the snow hiker',
//   //rating: 4.7,
//   price: 497,
//   //difficulty: 'easy',
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR :', err);
//   });
// if (process.env.NODE_ENV === 'development') {
//   console.log('in development mode');
// } else {
//   console.log('in production mode');
// }
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`lisenting to port ${port} 💥💥`);
});

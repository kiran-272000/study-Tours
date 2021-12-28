/* eslint-disable prettier/prettier */
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourmodel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
//   if (val > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid id',
//     });
//   }
//   next();
// };

// alaise///////////////////////////

exports.alaiseTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTour = catchAsync(async (req, res) => {
  //  BUILDING QUERY

  // //1) Filtering/////////////////////////////////////////////
  // const queryObj = { ...req.query }; // structuring
  // const excludedFeilds = ['page', 'limit', 'sort', 'fields'];
  // excludedFeilds.forEach((el) => {
  //   delete queryObj[el];
  // });

  // //2) Advanced Filtering////////////////////////////////////
  // let queryStr = JSON.stringify(queryObj);
  // /*
  //   /\b gte|gt|lte|lt\b/g  ==> this chekes for four words in the qurey
  // */
  // queryStr = queryStr.replace(/\b gte|gt|lte|lt \b/g, (match) => `$${match}`);
  // //console.log(JSON.parse(queryStr));

  // //method : 1
  // let query = Tour.find(JSON.parse(queryStr));

  //method: 2
  //console.log(req.query);
  // const query = await Tour.find({
  //   duration: 5,
  //   difficulty: 'easy',
  // });

  //method: 3

  // const query = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  //3) Sort

  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   //console.log(sortBy);
  //   query = query.sort(sortBy);
  // }

  //4) Field

  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   //console.log(fields);
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }

  // 5) Paging

  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;

  // const skip = (page - 1) * limit;

  // query = query.skip(skip).limit(limit);
  // if (req.query.page) {
  //   const tourCount = await Tour.countDocuments();
  //   //console.log(tourCount, skip);
  //   if (skip >= tourCount) throw new Error('This page not found');
  // }
  // EXECUTE QUERY
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paging();
  const tours = await features.query;
  res.status(200).json({
    //SEND RESPONSE

    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  let query = Tour.findById(req.params.id);
  query = query.select('-__v');
  const tour = await query;
  if (!tour) {
    return next(new AppError('Tour with this ID not found'));
  }
  //const tour = await Tour.findOne({ _id: req.params.id });
  res.status(200).json({
    status: 'sucess',
    data: {
      tour,
    },
  });

  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  //   status: 'sucess',
  //    data: {
  //      tour,
  //    },
  // });
});

exports.addTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({})
  // newTour.save()

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      tours: newTour,
    },
  });
});
// const newId = tours[tours.length - 1].id + 1;
// const newTour = Object.assign({ id: newId }, req.body);

// tours.push(newTour);

// fs.writeFile(
//   `${__dirname}/dev-data/data/tours-simple.json`,
//   JSON.stringify(tours),
//   (err) => {
//     res.status(201).json({
//       status: 'sucess',
//       data: {
//         tours: newTour,
//       },
//     });
//   }
// );

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true, // if this is set to true is checks for the validatiion in the schema if its false it will not check
  });

  if (!tour) {
    return next(new AppError('Tour with this ID not found', 404));
  }
  res.status(200).json({
    status: 'sucess',
    data: {
      tour,
    },
  });
});

// exports.deleteTour = async (req, res) => {
//   try {
//     await Tour.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: 'sucess',
//       data: null,
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };
exports.deleteTour = catchAsync(async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});

exports.getTourStat = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numtour: { $sum: 1 },
        numRatings: { $sum: 'ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minprice: { $min: '$price' },
        maxprice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match :{ _id: {$ne : 'EASY'}}
    // }
  ]);
  res.status(200).json({
    status: 'sucess',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numStartTour: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
        // month: 1,
        // numStartTour:1,
        // tours:1
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);
  res.status(200).json({
    status: 'sucess',
    result: plan.length,
    data: {
      plan,
    },
  });
});

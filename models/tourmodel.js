/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    // name : String,
    // rating : Number,
    // price : Number😍
    name: {
      type: String,
      // required : true,
      required: [true, 'a tour must have name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less or equal to 40 characters'],
      minlength: [10, 'A tour must have more or equal to 10 characters'],
      //validate: [validator.isAlpha, 'name must be a charecter'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a duration'],
    },
    difficulty: {
      type: String,
      lowercase: true,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: '{VALUE} is not supported',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'must be above 1.0'],
      max: [5, 'must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      //required: true,
      required: [true, 'price is required for tour'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'discoutn price should be lesser than the current price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual data which will not be stored
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
// tourSchema.virtual('test').get(function(){
//   return this.maxGroupSize +5;
// })

// document middleware : runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); // This Represents the Current Document
  next();
});
// // document middleware : multiple pre can be used
// tourSchema.pre('save' , function(next){
//   console.log('data saving');
//   next();
// })
// //document middleware : runs after .save() and .create()
// tourSchema.post('save', function(doc , next){
//   console.log(doc)
//   next()
// })

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); //This represents the Query
  this.start = Date.now();
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query takes ${Date.now() - this.start} milliseconds`);
//   //console.log(docs);
//   next();
// });

//AGGREGATE MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  //console.log(this.pipeline()); // this represents the aggrigation object
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //Elements to insert at the start of the array.  Inserts new elements at the start of an array, and returns the new length of the array

  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

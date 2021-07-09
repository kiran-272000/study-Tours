/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
  // name : String,
  // rating : Number,
  // price : Number😍
  name: {
    type: String,
    // required : true,
    required: [true, 'a tour must have name'],
    unique: true,
    trim: true,
  },
  slug : String,
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
    required: [true, 'A tour must have difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
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
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Atour must have summary'],
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
},
{
  toJSON: {virtuals: true},
  toObject : {virtuals:true}
}
);

// virtual data which will not be stored
tourSchema.virtual('durationWeeks').get(function(){
  return this.duration/7;
})
// tourSchema.virtual('test').get(function(){
//   return this.maxGroupSize +5;
// })

// document middleware : runs before .save() and .create()
tourSchema.pre('save' , function(next){
  this.slug = slugify(this.name , {lower : true})
  next()
})
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


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

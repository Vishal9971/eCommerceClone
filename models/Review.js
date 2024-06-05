const mongoose = require('mongoose');

let reviewSchema = new mongoose.Schema({
  rating:{
    type:Number,
    min:1,
    max:5,
    required:true,
  },
  comment:{
    type:String,
    trim:true,
  }
})

let Review = mongoose.model('Review', reviewSchema);


module.exports = Review;
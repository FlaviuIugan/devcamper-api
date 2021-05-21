const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");


// Get all review
// api/v1/courses
// api/v1/bootcamps/:bootcampId/reviews
// Public

exports.getReviews = asyncHandler( async (req,res,next) => {
  
  if(req.params.bootcampId) {
    const review = await Review.find({bootcamp: req.params.bootcampId})

    return res.status(200).json({
        succes:true,
        count: review.length,
        data: review
    });
  }else{
    res.status(200).json(res.advancedResults)
  }

});

// Get single review
// api/v1/review/:id
// Public

exports.getSingleReview = asyncHandler( async (req,res,next) => {
  const review = await Review.findById(req.params.id)
  .populate({path: "bootcamp", select: "name description"});

  if(!review){
    return next(new ErrorResponse(`No review found with the id of ${req.params.id}`,404));
  } 

  res.status(200).json({succes:true, data: review});
  
});

// Create review
// POST api/v1/bootcamps/:bootcampId/reviews/
// Private 

exports.addReview = asyncHandler( async (req,res,next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if(!bootcamp){
    return next(new ErrorResponse(`No bootcamp with the id of ${req.params.id}`, 404));
  }

  const review = await Review.create(req.body);

  res.status(200).json({
    succes: true,
    data: review
  })

});



// Update review
// PUT api/v1/reviews/:id
// Private 

exports.updateReview = asyncHandler( async (req,res,next) => {

  let review = await Review.findById(req.params.id);

  if(!review) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
  }

  if(review.user.toString() !== req.user.id && req.user.role !== "admin"){

    return next(new ErrorResponse(`Not authorize to update review`,401));
  }

  review =  await Review.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true});

  res.status(200).json({
    succes: true,
    data: review
  })
});

// Delete review
// DELETE api/v1/reviews/:id
// Private 

exports.deleteReview = asyncHandler( async (req,res,next) => {

  const review = await Review.findById(req.params.id);

  if(!review) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
  }

  if(review.user.toString() !== req.user.id && req.user.role !== "admin"){

    return next(new ErrorResponse(`Not authorize to update review`,401));
  }

  await review.remove();

  res.status(200).json({
    succes: true,
    data: {}
  })
});

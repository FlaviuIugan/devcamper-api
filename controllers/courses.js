const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");

// Get all course
// api/v1/courses
// api/v1/bootcamps/:bootcampId/courses
// Public

exports.getCourses = asyncHandler( async (req,res,next) => {
  let query;

  if(req.params.bootcampId) {
    query = Course.find({bootcamp: req.params.bootcampId});
  }else{
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description"
    });
  }

  const courses = await query;


  
  res.status(200).json({succes:true, count:courses.length, data: courses});
});

// Get single course
// api/v1/courses/:id

// Public

exports.getCourse = asyncHandler( async (req,res,next) => {
  const course = await Course.findById(req.params.id).populate({
    path:"bootcamp",
    select: "name description"
  });
  
  if(!course){
    return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
  }

  res.status(200).json({succes:true, data: course});
});

// Add course
// POST api/v1/bootcamps/:bootcampId/courses

// Private

exports.addCourse = asyncHandler( async (req,res,next) => {
  
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if(!bootcamp){
    return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`));
  }

  const course = await Course.create(req.body);

  res.status(200).json({succes:true, data: course});
});


// Update course
// PUT api/v1/courses/:id
// Private

exports.updateCourse = asyncHandler( async (req,res,next) => {
  let course = await Course.findById(req.params.id);

  if(!course){
    return next(new ErrorResponse(`No course with the id of ${req.params.id}`),404);
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {new: true,runValidators: true});


  res.status(200).json({succes: true, updatedCourse: course});
});

// Delete course
// delete api/v1/courses/:id
// Private

exports.deleteCourse = asyncHandler( async (req,res,next) => {
  const course = await Course.findById(req.params.id);

  if(!course){
    return next(new ErrorResponse(`No course with the id of ${req.params.id}`),404);
  }

  await course.remove();

  res.status(200).json({succes: true, data:{}});
});

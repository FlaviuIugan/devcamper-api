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
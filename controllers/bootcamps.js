const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async")


// Get all bootcamps
// api/v1/bootcamps
// Public
exports.getBootcamps = asyncHandler(  async(req,res,next) => {

    const bootcamps = await Bootcamp.find();
    
    res.status(200).json({succes:true,count:bootcamps.length, data: bootcamps});
  
});

// Get single bootcamp
// api/v1/bootcamps/:id
// Public

exports.getSingleBootcamp =  asyncHandler(async(req,res,next) => {
  
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
      return     next(new ErrorResponse(`BootCamp not found with the id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({succes:true, data:bootcamp});

});

// create new bootcamp
// api/v1/bootcamps/
// Private

exports.createBootcamp =  asyncHandler( async (req,res,next) => {

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({succes:true, data: bootcamp});

});


// Update bootcamp
// api/v1/bootcamps/:id
// Private

exports.updateBootcamp =  asyncHandler(async(req,res,next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      runValidators:true,
      new: true
    })
    if(!bootcamp) {
      return     next(new ErrorResponse(`BootCamp not found with the id of ${req.params.id}`, 404));
    }
    res.status(200).json({succes:true, data:bootcamp});


});

// Delete new bootcamp
// api/v1/bootcamps/:id
// Private

exports.deleteBootcamp = asyncHandler( async(req,res,next) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if(!bootcamp) {
      return     next(new ErrorResponse(`BootCamp not found with the id of ${req.params.id}`, 404));
    }

    res.status(400).json({succes:true, data:{}});

});
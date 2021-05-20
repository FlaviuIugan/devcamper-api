const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const path = require("path");


// Get all bootcamps
// api/v1/bootcamps
// Public
exports.getBootcamps = asyncHandler(  async(req,res,next) => {
  res.status(200).json(res.advancedResults);
  
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
    // Add user 
    req.body.user = req.user.id;

    //Check for published bootcamps

    const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});

    // If the user is not an admin, they can only add one bootcamp

    if(publishedBootcamp && req.user.role !== "admin"){
        return next(new ErrorResponse(`${req.user.id} Already published a bootcamp`, 404));
    }

    

    const bootcamp = await Bootcamp.create(req.body);


    res.status(201).json({succes:true, data: bootcamp});

});


// Update bootcamp
// api/v1/bootcamps/:id
// Private

exports.updateBootcamp =  asyncHandler(async(req,res,next) => {

    let bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp) {
      return     next(new ErrorResponse(`BootCamp not found with the id of ${req.params.id}`, 404));
    }

    // Make sure user is bootcamp owner

    if(bootcamp.user.toString() !== req.user.id && req.user.role !=="admin"){
        return next(new ErrorResponse(`User ${req.params.id} is not authorize to update this bootcamp`, 401));
    }

    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators : true
    });

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

    if(bootcamp.user.toString() !== req.user.id && req.user.role !=="admin"){
      return next(new ErrorResponse(`User ${req.params.id} is not authorize to delete this bootcamp`, 401));
    }

    bootcamp.remove();
    res.status(400).json({succes:true, data:{}});

});

// Get bootcamps within a radius
// Get  api/v1/bootcamps/radius/:zipcode/:distance
// Private

exports.getBootcampsInRadius = asyncHandler( async(req,res,next) => {

  const {zipcode,distance} = req.params;

  //GET LAT/LNG from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location:{ $geoWithin: {$centerSphere: [[ lng, lat], radius]}}
  });

  res.status(200).json({succes: true, count: bootcamps.length,data: bootcamps});
});


// Upload photo for bootcamp
// PUT /api/v1/bootcamp/:id/photo
// Private

exports.bootcampPhotoUpload = asyncHandler( async(req,res,next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`,404));
  }
  
  if(bootcamp.user.toString() !== req.user.id && req.user.role !=="admin"){
    return next(new ErrorResponse(`User ${req.params.id} is not authorize to update this bootcamp`, 401));
  }

  if(!req.files){
    return next(new ErrorResponse(`Please upload a file`, 404));
  }
  const file = req.files.file;

  if(!file.mimetype.startsWith("image")){
    return next(new ErrorResponse(`Please upload an image file`), 400);
  } 

  // check filesize

  if(file.size > process.env.MAX_FILE_UPLOAD){
    return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
  }

  // create custom filename

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if(err){
      console.error(err);
      return next(new ErrorResponse(`Problem with file`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});

    res.status(200).json({succes:true, data:file.name});
  })

});

const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");



// Get all bootcamps
// api/v1/bootcamps
// Public
exports.getBootcamps = asyncHandler(  async(req,res,next) => {

    let query;

    const reqQuery = { ...req.query};

    // FIELDS TO EXCLUDE FOR MATCH

    const removeFields = ["select", "sort"];

    removeFields.forEach( param => delete reqQuery);



    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match =>`$${match}`);

    query = Bootcamp.find(JSON.parse(queryStr));

    // SELECT FIELDS

    if(req.query.select){
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    if(req.query.sort){
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }else{
      query = query.sort("-createdAt");
    }

    const bootcamps = await query;


    
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
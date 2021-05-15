const Bootcamp = require("../models/Bootcamp");

// Get all bootcamps
// api/v1/bootcamps
// Public
exports.getBootcamps = async(req,res,next) => {
    const bootcamp = await Bootcamp.find()


    res.status(200).json({succes:true,count:bootcamp.length, data:bootcamp});
};

// Get single bootcamp
// api/v1/bootcamps/:id
// Public

exports.getSingleBootcamp = (req,res,next) => {
  res.status(200).json({succes:true, msg:"show me single bootcamp"});
};

// create new bootcamp
// api/v1/bootcamps/
// Private

exports.createBootcamp = async (req,res,next) => {
  try{
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({succes:true, data: bootcamp});
  }catch(err){
    res.status(400).json({succes:false, error:err});
  }
};


// Update bootcamp
// api/v1/bootcamps/:id
// Private

exports.updateBootcamp = (req,res,next) => {
  res.status(200).json({succes:true, msg:"Update Bootcamp"});
};


// Delete new bootcamp
// api/v1/bootcamps/:id
// Private

exports.deleteBootcamp = async(req,res,next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  res.status(200).json({succes:true, msg:"Delete bootcamp"});
};
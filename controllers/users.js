const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");


// Get all users
// Get /api/v1/auth/users
//  Public/Admin

exports.getUsers = asyncHandler(async(req,res,next)=> {

  res.status(200).json(res.advancedResults);

});

// Get single user
// Get /api/v1/auth/users/:id
//  Public/Admin

exports.getUser = asyncHandler(async(req,res,next)=> {

  const user = await User.findById(req.params.id);

  res.status(200).json({succes:true, data:user});
  
});

// Create user
// Get /api/v1/auth/users/
//  Public/Admin

exports.createUser = asyncHandler(async(req,res,next)=> {

  const user = await User.create(req.body);

  res.status(201).json({succes:true, data:user});
  
});



// update user
// PUT /api/v1/auth/users/:id
//  Public/Admin

exports.updateUser = asyncHandler(async(req,res,next)=> {

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({succes:true, data:user});
  
});


// detele user
// Delete /api/v1/auth/users/:id
//  Public/Admin

exports.deleteUser = asyncHandler(async(req,res,next)=> {

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({succes:true, data: {}});
});


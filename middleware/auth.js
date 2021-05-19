// Protect middleware to protect routes

const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

//Protect routes

exports.protect = asyncHandler(async(req,res,next) => {
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1]; 
  }
  // else if(req.cookies.token){
  //   token = req.cookies.token;
  // }

  //Make sure token exists

  if(!token){
    return next(new ErrorResponse("Not authorize to acces Token not good", 401))
  }
  try{  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    
    req.user = await User.findById(decoded.id);
    
    next();
  }catch(err){
    console.error(err);
    return next(new ErrorResponse("Not authorize to access!", 401))
  }
});


exports.authorize = (...roles) => {
  return (req,res,next) => {
    if(!roles.includes(req.user.role)){
      return next(new ErrorResponse(`User role ${req.user.role} is unauthorized to acces this route`, 403));
    }
    next();
  }
};
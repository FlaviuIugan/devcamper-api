const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// Register User
// POST api//v1/register
// Public

exports.register = asyncHandler(async(req,res,next)=> {

  const {name, email, password, role } = req.body;

  const user = await User.create({
    name, 
    email,
    password,
    role
  });

  // Create token
    sendTokenResponse(user,200,res);

});


//Login User
// Post api/v1/auth/login
// Public

exports.login = asyncHandler(async(req,res,next)=>{
  const {email,password} = req.body;

  //Validate email and password

  if(!email || !password) {
    return next(new ErrorResponse("Please provide and email and password ", 400));
  }
  // Check for user
  const user = await User.findOne({email}).select("+password");
  
  if(!user){
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  // Check if password matches

  const isMatch = await user.matchPassword(password);

  if(!isMatch){
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user,200,res);

})

//Get Token from model , create cookie and send respoonse

const sendTokenResponse = (user, statusCode, res) => {

  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if(process.env.NODE_ENV === "production"){
    option.secure= true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({succes:true, token});


};



// Get current logged in user
// POST /api/v1/auth/me
// Private

exports.getMe = asyncHandler(async(req,res,next)=> {
  const user = await User.findById(req.user.id);


  res.status(200).json({succes:true, data:user});
});
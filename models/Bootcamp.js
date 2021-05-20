const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"]
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description can not be more than 50 characters"]
  },
  website: {
    type: String,
    match: [/^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/ , "Please use a valid URL"]
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters']
  },
  email:{
    type: String,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/ , "Please add a valid email"]
  },
  address:{
    type:String,
    required: [true, "Please add an address"]
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      // required: true
    },
    coordinates: {
      type: [Number],
      // required: true,
      index: "2dsphere"
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  careers: {
    type: [String],
    required: true,
    enum: ["Web Development", "Mobile Development", "UI/UX", "Data Science", "Business", "Other"]
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not be more than 10"]
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg"
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee:{
    type: Boolean,
    default: false
  },
  acceptGi: {
    type:Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    toObject: {
      virtuals: true
    }
  }
});

// Create bootcamp slug from the name

  BootcampSchema.pre("save", function(next){
      this.slug = slugify(this.name, {lower : true});
      next();
  });

// GEOCODE AND CREATE LOCATION FIELD

BootcampSchema.pre("save",async function(next){

  const loc = await geocoder.geocode(this.address);

  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  }

  this.address = undefined;
  
  next();
});

  //Cascade delete courses when a bootcamp is deleted

  BootcampSchema.pre("remove", async function(next){
      await this.model("Course").deleteMany({bootcamp : this._id});
      next();
  });

// Create the virtual on the schema
// Reverse populate with virtauls

  BootcampSchema.virtual("courses", {
    ref: "Course",
    localField: "_id",
    foreignField: "bootcamp",
    justOne: false
  });

module.exports = mongoose.model("Bootcamp", BootcampSchema);
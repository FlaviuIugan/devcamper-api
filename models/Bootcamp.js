const mongoose = require("mongoose");

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
  }
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
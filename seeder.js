const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
dotenv.config({path: "./config/config.env"});

const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`));

const importData =async () => {
  try{
    await Course.create(courses);
    await Bootcamp.create(bootcamps);
    console.log("Data Imported...".green.underline.bold);
    process.exit();
  }
  catch(err){
    console.error(err);
  }
};

const deleteData = async() => {
  try{
    await Course.deleteMany();
    await Bootcamp.deleteMany();
    console.log("Data Deleted...".red.underline.bold)
    process.exit();
  }
  catch(err){
    console.error(err);
  }
};


if(process.argv[2] === "-i"){
  importData();
}else if(process.argv[2] === "-d"){
  deleteData();
}


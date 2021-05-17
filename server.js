const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const colors = require("colors");
const errorHandler = require("./middleware/error");
const morgan = require("morgan");
const connectDB = require("./config/db.js");

const PORT = process.env.PORT || 3000;
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");


connectDB();

const app = express();
app.use(express.json());


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);


app.use(errorHandler);


const server = app.listen("5000", console.log(`Server is running...in ${process.env.NODE_ENV} mode on  port : ${PORT}`.yellow.bold));



// HANDLE UNHANDLED promise rejection

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server and exit process;

  server.close(() => process.exit(1));
});
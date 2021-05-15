const express = require("express");
const dotenv = require("dotenv");
dotenv.config({path: "./config/config.env"});
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req,res) => {
  res.send(":) HOME PAGE");
})

app.listen("5000", console.log(`Server is running...in ${process.env.NODE_ENV} made on ${PORT}`));
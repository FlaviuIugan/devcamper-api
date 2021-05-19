const express = require("express");
const { getBootcamps, createBootcamp, getSingleBootcamp,updateBootcamp,deleteBootcamp,getBootcampsInRadius,bootcampPhotoUpload } = require("../controllers/bootcamps");
const Bootcamp = require("../models/Bootcamp");
const {protect,authorize} = require("../middleware/auth");

const advancedResults = require("../middleware/advancedResults");




const courseRouter = require("./courses");

const router = express.Router();


// Re-route int other resourse router;

router.use("/:bootcampId/courses", courseRouter);


router.route("/:id/photo").put(protect,authorize("publisher","admin"), bootcampPhotoUpload);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);


router.route("/").get(advancedResults(Bootcamp, "courses"), getBootcamps).post(protect,authorize("publisher","admin"),createBootcamp);
router.route("/:id").put(protect,authorize("publisher","admin"),updateBootcamp).get(getSingleBootcamp).delete(protect,authorize("publisher","admin"), deleteBootcamp);

module.exports = router;
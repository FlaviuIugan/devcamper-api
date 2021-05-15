const express = require("express");
const { getBootcamps, createBootcamp, getSingleBootcamp,updateBootcamp,deleteBootcamp } = require("../controllers/bootcamps");
const router = express.Router();

router.route("/").get(getBootcamps).post(createBootcamp);
router.route("/:id").put(updateBootcamp).get(getSingleBootcamp).delete(deleteBootcamp);

module.exports = router;
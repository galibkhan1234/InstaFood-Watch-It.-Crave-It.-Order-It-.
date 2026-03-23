
const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const feedController = require("../controllers/feed.controller");

router.get("/", protect, feedController.getFeed);

module.exports = router;
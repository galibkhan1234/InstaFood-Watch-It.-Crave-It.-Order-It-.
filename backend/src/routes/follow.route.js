const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const controller = require("../controllers/follow.controller");

router.post("/:userId/toggle", protect, controller.toggleFollow);
router.get("/:userId/followers", controller.getFollowers);
router.get("/:userId/following", controller.getFollowing);
router.get("/:userId/status", protect, controller.checkFollowStatus);

module.exports = router;
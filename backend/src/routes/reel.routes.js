const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const controller = require("../controllers/reel.controller");

// Get saved reels
router.get("/saved", protect, controller.getSavedReels);

// Generate Cloudinary signature
router.post(
  "/signature",
  protect,
  controller.generateUploadSignature
);

// Create reel after successful upload
router.post(
  "/",
  protect,
  controller.createReel
);

router.post("/:reelId/like", protect, controller.toggleLike);
router.post("/:reelId/comment", protect, controller.addComment);
router.delete("/:reelId/:commentId",protect,controller.deleteComment)
router.post("/:reelId/save", protect, controller.toggleSave);
router.post("/:reelId/share", protect, controller.shareReel);
router.post("/:reelId/view", protect, controller.trackView);


router.post(
  "/:reelId/click-product",
  protect,
  controller.trackProductClick
);
module.exports = router;
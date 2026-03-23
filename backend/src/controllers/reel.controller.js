const Reel = require("../models/reel.model");
const ReelLike = require("../models/likeReel.model");
const ReelComment = require("../models/reelComment.model");
const SaveReel = require("../models/saveReel.model");
const ShareReel = require("../models/shareReel.model");
const Restaurant = require("../models/restaurant.model");
const Product = require("../models/product.models");
const User = require("../models/user.model");

const {
    calculateEngagementScore,
    calculateFinalScore
} = require("../utils/score.utils");

const cloudinary = require("../config/cloudinary");

exports.generateUploadSignature = async (req, res, next) => {
  try {

    const { restaurantId } = req.body;

    // Validate restaurant ownership
    if (req.user.role !== "PARTNER")
      return res.status(403).json({ message: "Not authorized" });

    const timestamp = Math.round(new Date().getTime() / 1000);

    const folder = `instafood/reels/${restaurantId}`;

    const params = {
      timestamp,
      folder,
      allowed_formats: "mp4,mov,avi,webm",
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUD_API_SECRET
    );

    res.json({
      timestamp,
      signature,
      cloudName: process.env.CLOUD_NAME,
      apiKey: process.env.CLOUD_API_KEY,
      folder,
      allowedFormats: params.allowed_formats
    });

  } catch (error) {
    next(error);
  }
};

exports.createReel = async (req, res, next) => {
  try {

    const { restaurantId, videoUrl, caption, taggedProducts } = req.body;

    if (req.user.role !== "PARTNER")
      return res.status(403).json({ message: "Not authorized" });

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      owner: req.user.id
    });

    if (!restaurant)
      return res.status(403).json({ message: "Invalid restaurant access" });

    const reel = await Reel.create({
      restaurant: restaurantId,
      creator: req.user.id,
      videoUrl,
      caption,
      taggedProducts
    });

    res.status(201).json({ success: true, reel });

  } catch (error) {
    next(error);
  }
};

async function updateReelScore(reelId, incrementFields = {}) {

    const reel = await Reel.findByIdAndUpdate(
        reelId,
        { $inc: incrementFields },
        { new: true }
    );

    if (!reel) throw new Error("Reel not found");

    const engagementScore = calculateEngagementScore(reel);

    reel.engagementScore = engagementScore;
    reel.finalScore = calculateFinalScore(
        engagementScore,
        reel.conversionScore
    );

    await reel.save();

    return reel;
}


exports.toggleLike = async (req, res, next) => {
    try {

        const userId = req.user.id;
        const { reelId } = req.params;

        const existing = await ReelLike.findOne({
            user: userId,
            reel: reelId
        });

        let increment = 1;

        if (existing) {
            await existing.deleteOne();
            increment = -1;
        } else {
            await ReelLike.create({
                user: userId,
                reel: reelId
            });
        }

        await updateReelScore(reelId, { likesCount: increment });

        res.json({ success: true });

    } catch (error) {
        next(error);
    }
};


exports.addComment = async (req, res, next) => {
    try {

        const userId = req.user.id;
        const { reelId } = req.params;
        const { text } = req.body;

        if (!text || text.trim().length === 0)
            return res.status(400).json({ message: "Comment required" });

        await ReelComment.create({
            user: userId,
            reel: reelId,
            text
        });

        await updateReelScore(reelId, { commentsCount: 1 });

        res.json({ success: true });

    } catch (error) {
        next(error);
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { commentId } = req.params;
        const comment = await ReelComment.findById(commentId);

        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        if (comment.user.toString() !== userId)
            return res.status(403).json({ message: "Not authorized" });

        await comment.deleteOne();

        await updateReelScore(comment.reel, { commentsCount: -1 });

        res.json({ success: true });

    } catch (error) {
        next(error);
    }
};

exports.toggleSave = async (req, res, next) => {
    try {

        const userId = req.user.id;
        const { reelId } = req.params;

        const existing = await SaveReel.findOne({
            user: userId,
            reel: reelId
        });

        let increment = 1;

        if (existing) {
            await existing.deleteOne();
            increment = -1;
        } else {
            await SaveReel.create({
                user: userId,
                reel: reelId
            });
        }

        await updateReelScore(reelId, { savesCount: increment });

        res.json({ success: true });

    } catch (error) {
        next(error);
    }
};



exports.shareReel = async (req, res, next) => {
    try {

        const userId = req.user.id;
        const { reelId } = req.params;
        const { platform } = req.body;

        await ShareReel.create({
            user: userId,
            reel: reelId,
            platform
        });

        await updateReelScore(reelId, { sharesCount: 1 });

        res.json({ success: true });

    } catch (error) {
        next(error);
    }
};

exports.trackView = async (req, res, next) => {
    try {

        const { reelId } = req.params;
        const { watchTime = 0 } = req.body;

        await Reel.findByIdAndUpdate(
            reelId,
            {
                $inc: {
                    viewsCount: 1,
                    watchTimeTotal: watchTime
                }
            }
        );

        res.json({ success: true });

    } catch (error) {
        next(error);
    }
};

exports.getSavedReels = async (req, res, next) => {
    try {
        console.log("FETCHING SAVED REELS FOR USER:", req.user.id);
        const userId = req.user.id;

        const saved = await SaveReel.find({ user: userId })
            .populate({
                path: "reel",
                populate: [
                    { path: "restaurant", select: "name image" },
                    { path: "creator", select: "name profileImage" }
                ]
            })
            .sort({ createdAt: -1 });

        // Filter out null reels (in case a reel was deleted but save remained)
        const reels = saved
            .filter(s => s.reel)
            .map(s => {
                const reelObj = s.reel.toObject();
                // Ensure consistency with feed remapping
                if (reelObj.restaurant) {
                    reelObj.restaurant.restaurantName = reelObj.restaurant.name;
                }
                return reelObj;
            });

        res.json({ success: true, reels });

    } catch (error) {
        next(error);
    }
};

exports.trackProductClick = async (req, res, next) => {
  try {

    const { reelId } = req.params;
    const userId = req.user.id;

    // Store last clicked reel in session / DB
    await User.updateOne(
      { _id: userId },
      {
        lastReelClick: reelId,
        lastReelClickAt: new Date()
      }
    );

    await Reel.findByIdAndUpdate(
      reelId,
      { $inc: { productClicksCount: 1 } }
    );

    res.json({ success: true });

  } catch (error) {
    next(error);
  }
};
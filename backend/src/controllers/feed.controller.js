
const Reel = require("../models/reel.model");
const User = require("../models/user.model");
const feedService = require("../services/feed.service");
const redis = require("../config/redis");

exports.getFeed = async (req, res, next) => {
  try {

    const { cursorScore, cursorId, limit = 10 } = req.query;

    // Only cache first page
    if (!cursorScore && !cursorId) {
      try {
        const cached = await redis.get("feed:firstPage");
        if (cached) {
          return res.json(JSON.parse(cached));
        }
      } catch (redisErr) {
        console.log("Redis unavailable, proceeding to DB...");
      }
    }

    // ---- DB QUERY ----
    const reels = await Reel.find({ isActive: true })
      .populate("restaurant", "name image")
      .populate("taggedProducts", "name price image isAvailable")
      .sort({ finalScore: -1, _id: -1 })
      .limit(Number(limit));

    // Remap restaurant.name to restaurant.restaurantName for frontend if needed
    // or just let the frontend use .name. But ReelCard uses .restaurantName
    const formattedReels = reels.map(reel => {
      const reelObj = reel.toObject();
      if (reelObj.restaurant) {
        reelObj.restaurant.restaurantName = reelObj.restaurant.name;
      }
      return reelObj;
    });

    const response = {
      success: true,
      reels: formattedReels
    };

    // Cache only first page
    if (!cursorScore && !cursorId) {
      try {
        await redis.set(
          "feed:firstPage",
          JSON.stringify(response),
          "EX",
          60   // cache 60 seconds
        );
      } catch (redisErr) {
        // Ignore set error if redis is down
      }
    }

    res.json(response);

  } catch (error) {
    next(error);
  }
};
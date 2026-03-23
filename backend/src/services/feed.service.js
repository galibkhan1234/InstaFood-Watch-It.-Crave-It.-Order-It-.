// services/feed.service.js

const Reel = require("../models/reel.model");
const Follow = require("../models/follow.model");
const Restaurant = require("../models/restaurant.model");

exports.getFollowingIds = async (userId) => {
    const following = await Follow.find({ follower: userId })
        .select("following -_id");

    return following.map(f => f.following);
};

exports.getFeedCandidates = async ({
    userId,
    cursor,
    interestTags,
    coordinates
}) => {

    const followingIds = await exports.getFollowingIds(userId);

    const query = {
        isActive: true,
        $or: [
            { creator: { $in: followingIds } },
            { category: { $in: interestTags || [] } }
        ]
    };

    if (cursor) {
        query._id = { $lt: cursor };
    }

    return Reel.find(query)
        .sort({ finalScore: -1, _id: -1 })
        .limit(20)
        .populate("creator", "name profileImage")
        .populate("restaurant", "name ratingAverage");
};
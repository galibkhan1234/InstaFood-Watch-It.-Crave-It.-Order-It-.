const Follow = require("../models/follow.model");
const User = require("../models/user.model");



exports.toggleFollow = async (req, res, next) => {
    try {

        const followerId = req.user.id;
        const { userId } = req.params;

        if (followerId === userId)
            return res.status(400).json({ message: "Cannot follow yourself" });

        const existing = await Follow.findOne({
            follower: followerId,
            following: userId
        });

        if (existing) {
            await existing.deleteOne();
            await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
            await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });
            return res.json({ success: true, following: false });
        }

        await Follow.create({
            follower: followerId,
            following: userId
        });

        await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
        await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } });

        res.json({ success: true, following: true });

    } catch (error) {
        next(error);
    }
};

exports.getFollowers = async (req, res, next) => {
    try {

        const { userId } = req.params;

        const followers = await Follow.find({ following: userId })
            .populate("follower", "name profileImage")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: followers.length,
            data: followers
        });

    } catch (error) {
        next(error);
    }
};

exports.getFollowing = async (req, res, next) => {
    try {

        const { userId } = req.params;

        const following = await Follow.find({ follower: userId })
            .populate("following", "name profileImage")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: following.length,
            data: following
        });

    } catch (error) {
        next(error);
    }
};

exports.checkFollowStatus = async (req, res, next) => {
    try {

        const followerId = req.user.id;
        const { userId } = req.params;

        const existing = await Follow.findOne({
            follower: followerId,
            following: userId
        });

        res.json({
            success: true,
            isFollowing: !!existing
        });

    } catch (error) {
        next(error);
    }
};
const mongoose = require('mongoose');

const reelLikeSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    reel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reel',
        required: true,
        index: true
    }

}, { timestamps: true });

reelLikeSchema.index({ user: 1, reel: 1 }, { unique: true });
reelLikeSchema.index({ reel: 1, createdAt: -1 });

module.exports = mongoose.model('ReelLike', reelLikeSchema);
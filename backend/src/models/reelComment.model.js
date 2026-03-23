const mongoose = require('mongoose');

const reelCommentSchema = new mongoose.Schema({

    reel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reel',
        required: true,
        index: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    text: {
        type: String,
        required: true,
        trim: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

reelCommentSchema.index({ reel: 1, createdAt: -1 });

module.exports = mongoose.model('ReelComment', reelCommentSchema);
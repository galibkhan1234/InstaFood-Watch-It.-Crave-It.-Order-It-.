const mongoose = require('mongoose');

const reelShareSchema = new mongoose.Schema({

    reel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reel',
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    platform: {
        type: String, // whatsapp, instagram, link
        trim: true
    }

}, { timestamps: true });

reelShareSchema.index({ reel: 1 });
reelShareSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ReelShare', reelShareSchema);
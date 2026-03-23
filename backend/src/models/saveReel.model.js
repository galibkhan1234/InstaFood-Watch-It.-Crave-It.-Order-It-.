const mongoose = require('mongoose');

const reelSaveSchema = new mongoose.Schema({

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

reelSaveSchema.index({ user: 1, reel: 1 }, { unique: true });

module.exports = mongoose.model('ReelSave', reelSaveSchema);
const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({

    videoUrl: {
        type: String,
        required: true
    },

    caption: {
        type: String,
        trim: true
    },

    category: {
        type: String,
        index: true
    },

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
        index: true
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // -------- Social Metrics --------
    likesCount: {
        type: Number,
        default: 0,
        index: true
    },

    commentsCount: {
        type: Number,
        default: 0
    },

    sharesCount: {
        type: Number,
        default: 0
    },

    savesCount: {
        type: Number,
        default: 0
    },

    viewsCount: {
        type: Number,
        default: 0,
        index: true
    },

    watchTimeTotal: {
        type: Number,
        default: 0
    },

    // -------- Ranking Scores --------
    engagementScore: {
        type: Number,
        default: 0,
        index: true
    },

    conversionScore: {
        type: Number,
        default: 0
    },

    finalScore: {
        type: Number,
        default: 0,
        index: true
    },

    isActive: {
        type: Boolean,
        default: true,
        index: true
    },

    taggedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],

    foodName: String,
    price: Number,
    cuisineType: String,
    orderLinks: {
        zomato: String,
        swiggy: String
    }

}, { timestamps: true });

reelSchema.index({ finalScore: -1 });
reelSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Reel', reelSchema);
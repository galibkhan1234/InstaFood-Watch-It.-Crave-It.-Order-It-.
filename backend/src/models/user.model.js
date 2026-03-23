const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },

    role: {
        type: String,
        enum: ['USER', 'ADMIN', 'PARTNER'],
        default: 'USER',
        index: true
    },

    profileImage: {
        type: String,
        default: null
    },

    partnerStatus: {
        type: String,
        enum: ['NONE', 'PENDING', 'APPROVED', 'REJECTED'],
        default: 'NONE'
    },

    followersCount: {
        type: Number,
        default: 0
    },

    followingCount: {
        type: Number,
        default: 0
    },

    lastReelClick: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reel',
        default: null
    },

    lastReelClickAt: {
        type: Date,
        default: null
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isBlocked: {
        type: Boolean,
        default: false
    },

    refreshTokenVersion: {
        type: Number,
        default: 0
    },

    lastLoginAt: {
        type: Date
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
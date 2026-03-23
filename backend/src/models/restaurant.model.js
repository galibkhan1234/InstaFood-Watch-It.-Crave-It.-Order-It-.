const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    description: {
        type: String,
        trim: true
    },

    // Proper GeoJSON location for 2dsphere index
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
            index: true
        },
        state: String,
        pincode: String
    },

    cuisineTags: [{
        type: String,
        index: true
    }],

    category: {
        type: String,
        index: true
    },

    ratingAverage: {
        type: Number,
        default: 0
    },

    ratingCount: {
        type: Number,
        default: 0
    },

    image: {
        type: String
    },

    isOpen: {
        type: Boolean,
        default: true,
        index: true
    },

    isApproved: {
        type: Boolean,
        default: false,
        index: true
    },

    deliveryRadiusKm: {
        type: Number,
        default: 5
    }

}, { timestamps: true });



// Geo index for nearby search
restaurantSchema.index({ location: '2dsphere' });

// Text search index
restaurantSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
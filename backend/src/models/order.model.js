const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        
    },

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
        
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        image: String,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0
        }
    }],

    reelAttribution: {
  reel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reel"
  },
  source: {
    type: String,
    enum: ["FEED", "PROFILE", "SEARCH"]
  }
},

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    deliveryAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        city: { type: String, required: true },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        }
    },

    orderStatus: {
        type: String,
        enum: [
            'PENDING',
            'CONFIRMED',
            'PREPARING',
            'OUT_FOR_DELIVERY',
            'DELIVERED',
            'CANCELLED'
        ],
        default: 'PENDING',
    },

    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
        default: 'PENDING',
    },

    paymentMethod: {
        type: String,
    },

    statusHistory: [{
        status: String,
        changedAt: {
            type: Date,
            default: Date.now
        }
    }]

}, { timestamps: true });



// User order history
orderSchema.index({ user: 1, createdAt: -1 });

// Restaurant dashboard
orderSchema.index({ restaurant: 1, createdAt: -1 });

// Restaurant live status filtering
orderSchema.index({ restaurant: 1, orderStatus: 1, createdAt: -1 });

// Payment tracking
orderSchema.index({ paymentStatus: 1, createdAt: -1 });

// Geo index
orderSchema.index({ "deliveryAddress.coordinates": "2dsphere" });


// Push initial status automatically
orderSchema.pre('save', function (next) {
    if (this.isNew) {
        this.statusHistory.push({ status: this.orderStatus });
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
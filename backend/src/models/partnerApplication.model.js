const mongoose = require("mongoose");

const partnerApplicationSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  businessName: {
  type: String,
  required: true,
  trim: true,
  minlength: 2,
  maxlength: 100
},

businessType: {
  type: String,
  required: true,
  enum: [
    'RESTAURANT',
    'CLOUD_KITCHEN',
    'CAFE',
    'BAKERY',
    'SWEETS_SHOP',
    'FOOD_TRUCK',
    'BAR',
    'DHABA',
    'MESS',
    'HOME_CHEF',
    'OTHER'
  ],
  default: 'RESTAURANT'
},

  phone: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Invalid phone number']
  },

  address: {
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  state: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  postalCode: {
    type: String,
    required: true,
    match: [/^[1-9][0-9]{5}$/, 'Invalid postal code'],
    index: true
  }
},

  documents: [
  {
    type: {
      type: String,
      enum: ['GST', 'PAN', 'FSSAI', 'LICENSE', 'OTHER'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }
],

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
    index: true,
  },

  rejectionReason: {     
    type: String,
    default: null,
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  reviewedAt: Date,

}, { timestamps: true });

module.exports = mongoose.model("PartnerApplication", partnerApplicationSchema);
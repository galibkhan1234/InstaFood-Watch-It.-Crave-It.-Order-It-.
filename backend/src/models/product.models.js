const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500
    },

    price: {
      type: Number, // store in paise
      required: true,
      min: 0
    },

    foodType: {
      type: String,
      enum: ['VEG', 'NON_VEG', 'EGG'],
      required: true,
      index: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true
    },

    image: String,

    preparationTime: {
      type: Number,
      default: 15
    },

    isAvailable: {
      type: Boolean,
      default: true,
      index: true
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

productSchema.index({ restaurant: 1, category: 1 });
productSchema.index({ restaurant: 1, name: 1 }, { unique: true });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
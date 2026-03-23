const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const Restaurant = require('./src/models/restaurant.model');
require('dotenv').config();

async function fixUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Get the most recently created user
    const user = await User.findOne().sort({ createdAt: -1 });
    
    if (!user) {
      console.log('No users found');
      return;
    }

    // Update their role
    user.role = 'PARTNER';
    user.partnerStatus = 'APPROVED';
    await user.save();
    console.log(`Updated user ${user.email} to PARTNER`);

    // Ensure they have a restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: user._id });
    if (!existingRestaurant) {
      const rest = await Restaurant.create({
        owner: user._id,
        name: user.name + "'s Restaurant",
        phone: '1234567890',
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'Auto-generated Address',
          city: 'Default City'
        }
      });
      console.log(`Created auto-restaurant ${rest._id} for user`);
    } else {
      console.log('User already has a restaurant');
    }

    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixUser();

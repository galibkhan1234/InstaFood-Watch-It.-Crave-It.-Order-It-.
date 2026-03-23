const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const Restaurant = require('./src/models/restaurant.model');
const Reel = require('./src/models/reel.model');
require('dotenv').config();

async function testReelCreate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const user = await User.findOne({ role: 'PARTNER' });
    if (!user) {
      console.log('No PARTNER user found. Please run the fix-user script or register one.');
      process.exit(1);
    }

    const restaurant = await Restaurant.findOne({ owner: user._id });
    if (!restaurant) {
      console.log('PARTNER has no restaurant.');
      process.exit(1);
    }

    console.log(`Testing Reel creation for user ${user._id} and restaurant ${restaurant._id}...`);

    try {
      const reel = await Reel.create({
        restaurant: restaurant._id,
        creator: user._id,
        videoUrl: 'https://cloudinary.com/dummy.mp4',
        caption: 'Test Dummy - Reel',
        taggedProducts: undefined,
      });
      console.log('SUCCESS! Reel created:', reel._id);
    } catch (createErr) {
      console.error('FAILED AT REEL.CREATE!');
      console.error('Error Name:', createErr.name);
      console.error('Error Message:', createErr.message);
      console.error(createErr.stack);
    }

    process.exit(0);
  } catch (err) {
    console.error('Setup failed', err);
    process.exit(1);
  }
}

testReelCreate();

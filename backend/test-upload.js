const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const Restaurant = require('./src/models/restaurant.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function runTest() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ role: 'PARTNER' });
    const restaurant = await Restaurant.findOne({ owner: user._id });

    const token = jwt.sign({ id: user._id, role: user.role, tokenVersion: user.tokenVersion || 0 }, process.env.JWT_SECRET, { expiresIn: '10h' });

    const axios = require('axios');
    try {
      const response = await axios.post('http://localhost:5000/api/reels', {
        restaurantId: restaurant._id,
        videoUrl: 'https://cloudinary.com/dummy.mp4',
        caption: 'Food - test caption',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('SUCCESS:', response.data);
    } catch (err) {
      console.error('SERVER RESPONDED WITH ERROR:');
      console.error('Status:', err.response?.status);
      console.error('Data:', JSON.stringify(err.response?.data, null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Setup error:', error);
    process.exit(1);
  }
}

runTest();

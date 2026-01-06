const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't exit in serverless - just log the error
    if (process.env.VERCEL) {
      console.error('Running on Vercel - not exiting process');
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;

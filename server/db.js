require('dotenv').config();
const mongoose = require('mongoose');

let gridFSBucket;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      family: 4, // Force IPv4 to bypass Node 17+ DNS resolution issues
      serverSelectionTimeoutMS: 15000
    });
    console.log('✓ MongoDB connected');
    gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'media'
    });
    console.log('✓ GridFS initialized');
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

function getGridFSBucket() {
  if (!gridFSBucket) throw new Error('GridFSBucket not initialized. Call connectDB() first.');
  return gridFSBucket;
}

module.exports = { connectDB, getGridFSBucket };
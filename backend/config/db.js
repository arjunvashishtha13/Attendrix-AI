const mongoose = require('mongoose');
const { mongoUri } = require('./env');

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('Attendrix AI: MongoDB connected');
};

module.exports = connectDB;

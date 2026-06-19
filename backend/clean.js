const mongoose = require('mongoose');
require('dotenv').config();

async function clean() {
  await mongoose.connect(process.env.MONGO_URI);
  const CourseSession = require('./models/CourseSession');
  const result = await CourseSession.updateMany(
    { isActive: true },
    { $set: { isActive: false, endTime: new Date() } }
  );
  console.log('Closed', result.modifiedCount, 'sessions');
  process.exit(0);
}
clean();

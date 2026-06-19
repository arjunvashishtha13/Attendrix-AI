const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from the backend directory
dotenv.config({ path: './backend/.env' });

const CourseSession = require('./backend/models/CourseSession');

async function resetSessions() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB');

    const result = await CourseSession.updateMany(
      { isActive: true },
      { $set: { isActive: false, endTime: new Date() } }
    );
    console.log(`Successfully closed ${result.modifiedCount} active sessions.`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

resetSessions();

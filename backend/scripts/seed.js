require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const { mongoUri } = require('../config/env');

const seed = async () => {
  await mongoose.connect(mongoUri);
  await Promise.all([User.deleteMany({}), Course.deleteMany({}), Attendance.deleteMany({})]);

  const admin = await User.create({
    username: 'admin',
    email: 'admin@attendrix.ai',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    profile: { fullName: 'Platform Admin' },
  });

  const teacher = await User.create({
    username: 'teacher',
    email: 'teacher@attendrix.ai',
    password: bcrypt.hashSync('teacher123', 10),
    role: 'teacher',
    profile: { fullName: 'Dr. Sarah Chen', employeeId: 'TCH-001' },
  });

  const student = await User.create({
    username: 'student',
    email: 'student@attendrix.ai',
    password: bcrypt.hashSync('student123', 10),
    role: 'student',
    profile: {
      fullName: 'Alex Rivera',
      enrollmentNumber: 'ENR-2024-001',
      branch: 'Computer Science',
      year: 3,
      semester: 2,
    },
  });

  const course = await Course.create({
    code: 'CS101',
    name: 'Introduction to AI Systems',
    teacher: teacher._id,
    students: [student._id],
    totalSessions: 30,
  });

  const dates = [0, 1, 2, 3, 4].map((d) => {
    const date = new Date();
    date.setDate(date.getDate() - d * 7);
    return date;
  });

  for (const date of dates) {
    await Attendance.create({
      course: course._id,
      student: student._id,
      date,
      status: Math.random() > 0.2 ? 'present' : 'absent',
      method: 'manual',
      markedBy: teacher._id,
      confidence: 0.85 + Math.random() * 0.1,
    });
  }

  console.log('Seed complete:');
  console.log('  admin / admin123');
  console.log('  teacher / teacher123');
  console.log('  student / student123');
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

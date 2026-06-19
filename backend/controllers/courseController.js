const Course = require('../models/Course');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

exports.createCourse = asyncHandler(async (req, res) => {
  const { code, name, schedule, studentIds, location } = req.body;
  if (!code || !name) throw new AppError('Course code and name required', 400);

  const teacherId = req.user.role === 'admin' ? req.body.teacherId || req.user._id : req.user._id;

  const course = await Course.create({
    code: code.toUpperCase(),
    name,
    teacher: teacherId,
    students: studentIds || [],
    schedule,
    location,
  });

  await course.populate('teacher', 'username profile email role');
  res.status(201).json({ success: true, course });
});

exports.getCourses = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role === 'teacher') filter.teacher = req.user._id;
  if (req.user.role === 'student') filter.students = req.user._id;

  const courses = await Course.find(filter)
    .populate('teacher', 'username profile email')
    .populate('students', 'username profile email');

  res.json({ success: true, courses });
});

exports.getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('teacher', 'username profile email')
    .populate('students', 'username profile email faceEmbedding');

  if (!course) throw new AppError('Course not found', 404);
  res.json({ success: true, course });
});

exports.updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new AppError('Course not found', 404);

  if (req.user.role === 'teacher' && course.teacher.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  const { name, schedule, studentIds, totalSessions, location } = req.body;
  if (name) course.name = name;
  if (schedule) course.schedule = schedule;
  if (totalSessions) course.totalSessions = totalSessions;
  if (studentIds) course.students = studentIds;
  if (location) course.location = location;

  await course.save();
  res.json({ success: true, course });
});

exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) throw new AppError('Course not found', 404);
  res.json({ success: true, message: 'Course deleted' });
});

exports.enrollStudent = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new AppError('Course not found', 404);

  const student = await User.findById(req.body.studentId);
  if (!student || student.role !== 'student') throw new AppError('Invalid student', 400);

  if (!course.students.some((s) => s.toString() === student._id.toString())) {
    course.students.push(student._id);
    await course.save();
  }

  res.json({ success: true, course });
});

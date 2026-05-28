const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { extractEmbedding, findBestMatch } = require('../services/faceRecognitionService');
const { sendAttendanceReminder } = require('../services/emailService');

exports.markAttendance = asyncHandler(async (req, res) => {
  const { courseId, studentId, status, date, sessionNote } = req.body;
  if (!courseId || !studentId) throw new AppError('courseId and studentId required', 400);

  const day = new Date(date || Date.now());
  day.setHours(0, 0, 0, 0);

  const record = await Attendance.findOneAndUpdate(
    {
      course: courseId,
      student: studentId,
      date: day,
    },
    {
      course: courseId,
      student: studentId,
      status: status || 'present',
      method: 'manual',
      markedBy: req.user._id,
      sessionNote,
      date: date ? new Date(date) : new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
    .populate('student', 'username profile email')
    .populate('course', 'code name');

  res.status(201).json({ success: true, record });
});

exports.webcamAttendance = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  if (!req.file?.buffer) throw new AppError('Webcam capture required', 400);
  if (!courseId) throw new AppError('courseId required', 400);

  const course = await Course.findById(courseId).populate('students');
  if (!course) throw new AppError('Course not found', 404);

  const students = await User.find({
    _id: { $in: course.students },
    faceEmbedding: { $exists: true, $not: { $size: 0 } },
  });

  const probeEmbedding = extractEmbedding(req.file.buffer);
  const match = findBestMatch(probeEmbedding, students);

  if (!match.matched) {
    return res.status(422).json({
      success: false,
      ...match,
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const record = await Attendance.findOneAndUpdate(
    { course: courseId, student: match.student._id, date: today },
    {
      course: courseId,
      student: match.student._id,
      status: 'present',
      method: 'webcam',
      confidence: match.confidence,
      markedBy: req.user._id,
      date: new Date(),
    },
    { upsert: true, new: true }
  )
    .populate('student', 'username profile')
    .populate('course', 'code name');

  res.json({
    success: true,
    record,
    confidence: match.confidence,
    threshold: match.threshold,
    message: match.message,
  });
});

exports.uploadAttendance = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  if (!req.file?.buffer) throw new AppError('Photo required', 400);

  req.body.courseId = courseId;
  return exports.webcamAttendance(req, res);
});

exports.getAttendanceByCourse = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ course: req.params.courseId })
    .populate('student', 'username profile email')
    .populate('course', 'code name')
    .sort({ date: -1 });

  res.json({ success: true, records });
});

exports.getMyAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ student: req.user._id })
    .populate('course', 'code name totalSessions')
    .sort({ date: -1 });

  res.json({ success: true, records });
});

exports.sendReminder = asyncHandler(async (req, res) => {
  const { courseId, studentId } = req.body;
  const course = await Course.findById(courseId);
  const student = await User.findById(studentId);
  if (!course || !student) throw new AppError('Invalid course or student', 400);

  const records = await Attendance.find({ course: courseId, student: studentId });
  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const total = course.totalSessions || 30;
  const percentage = Math.round((present / total) * 100);

  const result = await sendAttendanceReminder(student, course, { present, absent, percentage });
  res.json({ success: true, ...result });
});

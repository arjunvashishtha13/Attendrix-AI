const Attendance = require('../models/Attendance');
const CourseSession = require('../models/CourseSession');
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

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the earth in m
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in m
}

exports.markLiveAttendance = asyncHandler(async (req, res) => {
  const { sessionId, liveEmbedding, latitude, longitude } = req.body;
  if (!sessionId || !liveEmbedding || !Array.isArray(liveEmbedding)) {
    throw new AppError('sessionId and liveEmbedding are required', 400);
  }

  const session = await CourseSession.findById(sessionId).populate('course');
  if (!session) throw new AppError('Session not found', 404);
  if (!session.isActive) throw new AppError('This attendance session is closed', 403);

  const course = session.course;

  if (session.location && session.location.lat && session.location.lng) {
    if (!latitude || !longitude) {
      throw new AppError('Location data is required for this session. Please enable GPS.', 403);
    }
    const distance = getDistanceFromLatLonInM(
      session.location.lat, session.location.lng,
      parseFloat(latitude), parseFloat(longitude)
    );
    if (distance > (session.location.radius || 50)) {
      throw new AppError(`You are too far from the classroom (${Math.round(distance)}m). You must be within ${session.location.radius || 50}m.`, 403);
    }
  }

  const students = await User.find({
    _id: { $in: course.students },
    hasEnrolledFace: true,
  });

  if (students.length === 0) {
    throw new AppError('No students have enrolled faces for this course', 400);
  }

  const match = findBestMatch(liveEmbedding, students);

  if (!match.matched) {
    return res.status(422).json({
      success: false,
      ...match,
    });
  }

  if (req.user.role === 'student' && match.student._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You can only mark attendance for yourself. Face mismatch.',
    });
  }

  const record = await Attendance.findOneAndUpdate(
    { session: session._id, student: match.student._id },
    {
      course: course._id,
      session: session._id,
      student: match.student._id,
      status: 'present',
      method: 'webcam',
      confidence: match.confidence,
      markedBy: req.user._id,
      date: new Date(),
      locationCaptured: latitude && longitude ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : undefined,
      livenessPassed: true,
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

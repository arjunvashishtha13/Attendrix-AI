const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const CourseSession = require('../models/CourseSession');
const Department = require('../models/Department');
const Campus = require('../models/Campus');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const bcrypt = require('bcryptjs');

// --- USER MANAGEMENT ---
exports.getUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.status) filter.status = req.query.status;
  
  const users = await User.find(filter)
    .populate('profile.departmentRef', 'name code')
    .select('-password');
  res.json({ success: true, users });
});

exports.createUser = asyncHandler(async (req, res) => {
  const { username, email, password, role, profile, status } = req.body;
  if (!username || !email || !password) throw new AppError('Missing required fields', 400);

  const user = await User.create({
    username,
    email,
    password: bcrypt.hashSync(password, 10),
    role: role || 'student',
    profile: profile || {},
    status: status || 'active'
  });
  
  res.status(201).json({ success: true, user });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { password, ...updateData } = req.body;
  if (password) {
    updateData.password = bcrypt.hashSync(password, 10);
  }
  const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, message: 'User deleted' });
});

// --- FACE VERIFICATION MANAGEMENT ---
exports.getPendingFaces = asyncHandler(async (req, res) => {
  // Find users who have enrolled face but maybe need manual review, or find recent failed attendances
  // For now, let's return users who have faceEmbeddings
  const users = await User.find({ hasEnrolledFace: true }).select('username profile email faceEmbeddings');
  res.json({ success: true, users });
});

exports.getVerificationLogs = asyncHandler(async (req, res) => {
  const logs = await Attendance.find({ method: 'webcam' })
    .populate('student', 'username profile email')
    .populate('course', 'name code')
    .sort('-date')
    .limit(100);
  res.json({ success: true, logs });
});

exports.rejectFace = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  user.faceEmbeddings = [];
  user.hasEnrolledFace = false;
  await user.save();
  res.json({ success: true, message: 'Face records deleted. User must re-enroll.' });
});

// --- ANALYTICS ---
exports.getAnalyticsOverview = asyncHandler(async (req, res) => {
  const [totalStudents, totalTeachers, totalCourses, totalDepartments, activeSessions, totalRecords] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'teacher' }),
    Course.countDocuments(),
    Department.countDocuments(),
    CourseSession.countDocuments({ isActive: true }),
    Attendance.countDocuments()
  ]);

  const presentRecords = await Attendance.countDocuments({ status: 'present' });
  const attendancePercentage = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

  // Verification Success Rate
  const webcamAttempts = await Attendance.countDocuments({ method: 'webcam' });
  const successfulWebcamAttempts = await Attendance.countDocuments({ method: 'webcam', livenessPassed: true });
  const verificationSuccessRate = webcamAttempts > 0 ? Math.round((successfulWebcamAttempts / webcamAttempts) * 100) : 0;

  res.json({
    success: true,
    stats: {
      totalStudents,
      totalTeachers,
      totalCourses,
      totalDepartments,
      activeSessions,
      totalRecords,
      attendancePercentage,
      verificationSuccessRate
    }
  });
});

// --- GEOLOCATION SETTINGS ---
exports.getCampuses = asyncHandler(async (req, res) => {
  const campuses = await Campus.find();
  res.json({ success: true, campuses });
});

exports.createCampus = asyncHandler(async (req, res) => {
  const campus = await Campus.create(req.body);
  res.status(201).json({ success: true, campus });
});

exports.deleteCampus = asyncHandler(async (req, res) => {
  await Campus.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Campus deleted' });
});

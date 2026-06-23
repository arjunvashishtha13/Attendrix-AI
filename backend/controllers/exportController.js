const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { attendanceToCSV, attendanceToPDF } = require('../services/exportService');

const fetchRecords = async (req) => {
  const { courseId, departmentId, studentId, startDate, endDate } = req.query;
  const user = req.user;
  let filter = {};

  if (courseId) filter.course = courseId;
  if (studentId) filter.student = studentId;
  
  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  if (user.role === 'student') filter.student = user._id;

  if (user.role === 'teacher') {
    const courses = await Course.find({ teacher: user._id });
    const courseIds = courses.map(c => c._id);
    if (courseId && !courseIds.some(id => id.toString() === courseId)) {
      throw new AppError('Not authorized for this course', 403);
    }
    if (!courseId) filter.course = { $in: courseIds };
  }

  // Admin can filter by department
  if (user.role === 'admin' && departmentId) {
    const students = await require('../models/User').find({ 'profile.departmentRef': departmentId }).select('_id');
    filter.student = { $in: students.map(s => s._id) };
  }

  return Attendance.find(filter)
    .populate('student', 'username profile email')
    .populate('course', 'code name')
    .sort({ date: -1 });
};

exports.exportCSV = asyncHandler(async (req, res) => {
  const records = await fetchRecords(req);
  const csv = attendanceToCSV(records);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=attendrix-report.csv`);
  res.send(csv);
});

exports.exportPDF = asyncHandler(async (req, res) => {
  const records = await fetchRecords(req);
  const course = records[0]?.course;
  const buffer = await attendanceToPDF(records, {
    title: `Attendance Report ${course ? '— ' + course.code : ''}`,
  });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=attendrix-report.pdf`);
  res.send(buffer);
});

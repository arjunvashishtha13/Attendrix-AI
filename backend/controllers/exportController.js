const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { attendanceToCSV, attendanceToPDF } = require('../services/exportService');

const fetchRecords = async (courseId, user) => {
  const filter = { course: courseId };
  if (user.role === 'student') filter.student = user._id;

  if (user.role === 'teacher') {
    const course = await Course.findById(courseId);
    if (!course || course.teacher.toString() !== user._id.toString()) {
      throw new AppError('Not authorized for this course', 403);
    }
  }

  return Attendance.find(filter)
    .populate('student', 'username profile email')
    .populate('course', 'code name')
    .sort({ date: -1 });
};

exports.exportCSV = asyncHandler(async (req, res) => {
  const records = await fetchRecords(req.params.courseId, req.user);
  const csv = attendanceToCSV(records);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=attendrix-${req.params.courseId}.csv`);
  res.send(csv);
});

exports.exportPDF = asyncHandler(async (req, res) => {
  const records = await fetchRecords(req.params.courseId, req.user);
  const course = records[0]?.course;
  const buffer = await attendanceToPDF(records, {
    title: `Attendance Report — ${course?.code || req.params.courseId}`,
  });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=attendrix-${req.params.courseId}.pdf`);
  res.send(buffer);
});

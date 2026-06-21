const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const CourseSession = require('../models/CourseSession');
const asyncHandler = require('../middleware/asyncHandler');

exports.getTeacherDashboard = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;
  const { startDate, endDate, sessionId, courseId } = req.query;

  // Active courses
  const courseMatch = { teacher: teacherId };
  if (courseId) courseMatch._id = courseId;
  const courses = await Course.find(courseMatch);
  const courseIds = courses.map((c) => c._id);
  
  // Total students (unique)
  const allStudents = new Set();
  courses.forEach(c => c.students.forEach(s => allStudents.add(s.toString())));

  // Base match for attendance
  const match = { course: { $in: courseIds } };
  if (sessionId) {
    match.session = sessionId;
  } else if (startDate && endDate) {
    match.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  // Today's attendance
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date();
  endOfDay.setHours(23,59,59,999);

  const todaysRecords = await Attendance.find({
    course: { $in: courseIds },
    date: { $gte: startOfDay, $lte: endOfDay }
  });

  let todayPresent = 0;
  todaysRecords.forEach(r => {
    if (r.status === 'present') todayPresent++;
  });
  const todayPercentage = todaysRecords.length ? Math.round((todayPresent / todaysRecords.length) * 100) : 0;

  // Total sessions (filtered by date if provided)
  const sessionMatch = { course: { $in: courseIds } };
  if (sessionId) sessionMatch._id = sessionId;
  else if (startDate && endDate) sessionMatch.startTime = { $gte: new Date(startDate), $lte: new Date(endDate) };
  const totalSessions = await CourseSession.countDocuments(sessionMatch);

  // Students At Risk (Calculated based on filtered records)
  const filteredRecords = await Attendance.find(match).populate('student', 'username profile email');
  const studentStats = {};
  filteredRecords.forEach(r => {
    if (!r.student) return;
    const sId = r.student._id.toString();
    if (!studentStats[sId]) {
      studentStats[sId] = {
        _id: sId,
        name: r.student.profile?.fullName || r.student.username,
        email: r.student.email,
        present: 0,
        total: 0
      };
    }
    studentStats[sId].total++;
    if (r.status === 'present') studentStats[sId].present++;
  });
  
  let studentsAtRiskCount = 0;
  const studentsAtRiskList = [];
  Object.values(studentStats).forEach(s => {
    const percentage = Math.round((s.present / s.total) * 100);
    if (percentage < 75) {
      studentsAtRiskCount++;
      studentsAtRiskList.push({ ...s, percentage });
    }
  });

  res.json({
    success: true,
    stats: {
      totalStudents: allStudents.size,
      activeCourses: courses.length,
      todayAttendancePercentage: todayPercentage,
      totalSessions: totalSessions,
      pendingRequests: 0, // Placeholder if you add manual requests later
      studentsAtRisk: studentsAtRiskCount,
      studentsAtRiskList,
    }
  });
});

exports.getStudentAnalytics = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;
  const courses = await Course.find({ teacher: teacherId }).select('_id name code students');
  const courseIds = courses.map(c => c._id);

  const records = await Attendance.find({ course: { $in: courseIds } }).populate('student', 'username profile email');

  const studentMap = {};
  records.forEach(r => {
    if (!r.student) return;
    const sId = r.student._id.toString();
    if (!studentMap[sId]) {
      studentMap[sId] = {
        _id: sId,
        name: r.student.profile?.fullName || r.student.username,
        email: r.student.email,
        present: 0,
        total: 0
      };
    }
    studentMap[sId].total++;
    if (r.status === 'present') studentMap[sId].present++;
  });

  const studentStats = Object.values(studentMap).map(s => ({
    ...s,
    percentage: Math.round((s.present / s.total) * 100)
  })).sort((a, b) => b.percentage - a.percentage);

  const highest = studentStats.slice(0, 5);
  const lowest = [...studentStats].sort((a, b) => a.percentage - b.percentage).slice(0, 5);
  const below75 = studentStats.filter(s => s.percentage < 75);
  const below60 = studentStats.filter(s => s.percentage < 60);

  res.json({
    success: true,
    data: {
      all: studentStats,
      highest,
      lowest,
      below75,
      below60
    }
  });
});

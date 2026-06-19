const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const asyncHandler = require('../middleware/asyncHandler');

const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const { courseId } = req.query;
  const match = {};
  if (courseId) match.course = courseId;

  if (req.user.role === 'student') match.student = req.user._id;
  if (req.user.role === 'teacher') {
    const teacherCourses = await Course.find({ teacher: req.user._id }).select('_id');
    match.course = { $in: teacherCourses.map((c) => c._id) };
  }

  const records = await Attendance.find(match).populate('course', 'code name totalSessions');

  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const late = records.filter((r) => r.status === 'late').length;
  const total = present + absent + late || 1;

  const monthlyMap = {};
  records.forEach((r) => {
    const key = monthKey(new Date(r.date));
    if (!monthlyMap[key]) monthlyMap[key] = { month: key, present: 0, absent: 0 };
    if (r.status === 'present') monthlyMap[key].present += 1;
    else monthlyMap[key].absent += 1;
  });

  const byCourse = {};
  records.forEach((r) => {
    const code = r.course?.code || 'unknown';
    if (!byCourse[code]) byCourse[code] = { course: code, name: r.course?.name, present: 0, absent: 0 };
    if (r.status === 'present') byCourse[code].present += 1;
    else byCourse[code].absent += 1;
  });

  const courseStats = Object.values(byCourse).map((c) => {
    const t = c.present + c.absent || 1;
    return { ...c, percentage: Math.round((c.present / t) * 100) };
  });

  const bySession = {};
  records.forEach((r) => {
    if (!r.session) return;
    const sId = r.session.toString();
    const dateStr = new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const sessionLabel = `Session: ${dateStr}`;
    if (!bySession[sId]) bySession[sId] = { session: sId, label: sessionLabel, present: 0, absent: 0 };
    if (r.status === 'present') bySession[sId].present += 1;
    else bySession[sId].absent += 1;
  });

  const sessionStats = Object.values(bySession).map((s) => {
    const t = s.present + s.absent || 1;
    return { ...s, percentage: Math.round((s.present / t) * 100) };
  }).sort((a, b) => a.label.localeCompare(b.label));

  res.json({
    success: true,
    stats: {
      present,
      absent,
      late,
      total,
      attendancePercentage: Math.round((present / total) * 100),
      monthlyTrends: Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month)),
      courseBreakdown: courseStats,
      sessionBreakdown: sessionStats,
      recentRecords: records.slice(0, 10),
    },
  });
});

exports.getAdminOverview = asyncHandler(async (req, res) => {
  const [courseCount, recordCount, courses] = await Promise.all([
    Course.countDocuments(),
    Attendance.countDocuments(),
    Course.find().populate('teacher', 'username profile').limit(20),
  ]);

  const records = await Attendance.find().limit(500);
  const present = records.filter((r) => r.status === 'present').length;

  res.json({
    success: true,
    overview: {
      courses: courseCount,
      attendanceRecords: recordCount,
      platformAttendanceRate: records.length ? Math.round((present / records.length) * 100) : 0,
      recentCourses: courses,
    },
  });
});

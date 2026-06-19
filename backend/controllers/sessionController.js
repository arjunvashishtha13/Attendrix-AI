const CourseSession = require('../models/CourseSession');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

exports.createSession = asyncHandler(async (req, res) => {
  const { courseId, durationMinutes, location } = req.body;
  if (!courseId) throw new AppError('courseId is required', 400);

  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found', 404);

  // Check for existing active session
  const existing = await CourseSession.findOne({ course: courseId, isActive: true });
  if (existing) {
    throw new AppError('An active session already exists for this course', 400);
  }

  // Close any other active sessions this teacher might have forgotten to close
  await CourseSession.updateMany(
    { teacher: req.user._id, isActive: true, course: { $ne: courseId } },
    { $set: { isActive: false, endTime: new Date() } }
  );

  const endTime = durationMinutes ? new Date(Date.now() + durationMinutes * 60000) : null;

  const session = await CourseSession.create({
    course: courseId,
    teacher: req.user._id,
    endTime,
    location,
  });

  res.status(201).json({ success: true, session });
});

exports.getActiveSession = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const session = await CourseSession.findOne({ course: courseId, isActive: true });

  if (!session) {
    return res.status(404).json({ success: false, message: 'No active session found' });
  }

  if (session.endTime && new Date() > session.endTime) {
    session.isActive = false;
    await session.save();
    return res.status(404).json({ success: false, message: 'Session expired' });
  }

  res.json({ success: true, session });
});

exports.closeSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const session = await CourseSession.findById(id);
  if (!session) throw new AppError('Session not found', 404);

  session.isActive = false;
  session.endTime = new Date();
  await session.save();

  // Auto-mark absent for students who didn't mark present
  const course = await Course.findById(session.course);
  if (course && course.students && course.students.length > 0) {
    const Attendance = require('../models/Attendance');
    const presentRecords = await Attendance.find({ session: id });
    const presentStudentIds = presentRecords.map(r => r.student.toString());
    
    const absentRecords = [];
    for (const studentId of course.students) {
      if (!presentStudentIds.includes(studentId.toString())) {
        absentRecords.push({
          course: session.course,
          student: studentId,
          session: id,
          status: 'absent',
          method: 'manual',
          markedBy: req.user._id,
        });
      }
    }
    
    if (absentRecords.length > 0) {
      await Attendance.insertMany(absentRecords);
    }
  }

  res.json({ success: true, session });
});

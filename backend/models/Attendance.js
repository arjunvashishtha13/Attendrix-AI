const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['present', 'absent', 'late', 'failed'], default: 'present' },
    method: { type: String, enum: ['manual', 'webcam', 'upload'], default: 'manual' },
    confidence: { type: Number, min: 0, max: 1 },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSession' },
    locationCaptured: { lat: Number, lng: Number },
    livenessPassed: { type: Boolean, default: false },
    failureReason: { type: String, default: '' },
  },
  { timestamps: true }
);

attendanceSchema.index({ course: 1, student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

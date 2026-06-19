const mongoose = require('mongoose');

const courseSessionSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    isActive: { type: Boolean, default: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      radius: { type: Number, default: 50 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CourseSession', courseSessionSchema);

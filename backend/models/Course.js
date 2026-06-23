const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    semester: { type: Number, default: 1 },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    schedule: { type: String, default: '' },
    totalSessions: { type: Number, default: 30 },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      radius: { type: Number, default: 50 } // default 50 meters
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);

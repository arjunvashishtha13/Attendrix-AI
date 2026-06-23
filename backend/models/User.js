const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['admin', 'teacher', 'student'],
      default: 'student',
      required: true,
    },
    profile: {
      fullName: { type: String, default: '' },
      avatar: { type: String, default: '' },
      employeeId: { type: String, default: '' },
      enrollmentNumber: { type: String, default: '' },
      branch: { type: String, default: '' },
      year: { type: Number, default: 1 },
      semester: { type: Number, default: 1 },
      phone: { type: String, default: '' },
      departmentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
      department: { type: String, default: '' },
      designation: { type: String, default: '' },
    },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    faceEmbeddings: { type: [[Number]], default: [] },
    hasEnrolledFace: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

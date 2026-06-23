const Department = require('../models/Department');
const User = require('../models/User');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

exports.createDepartment = asyncHandler(async (req, res) => {
  const { name, code, description, headOfDepartment } = req.body;
  if (!name || !code) throw new AppError('Department name and code are required', 400);

  const dept = await Department.create({ name, code: code.toUpperCase(), description, headOfDepartment });
  res.status(201).json({ success: true, department: dept });
});

exports.getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().populate('headOfDepartment', 'username profile email');
  
  // Also calculate total students, teachers, courses per department
  const stats = await Promise.all(departments.map(async (d) => {
    const totalStudents = await User.countDocuments({ 'profile.departmentRef': d._id, role: 'student' });
    const totalTeachers = await User.countDocuments({ 'profile.departmentRef': d._id, role: 'teacher' });
    const totalCourses = await Course.countDocuments({ department: d._id });
    
    return {
      ...d.toObject(),
      totalStudents,
      totalTeachers,
      totalCourses
    };
  }));

  res.json({ success: true, departments: stats });
});

exports.updateDepartment = asyncHandler(async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!dept) throw new AppError('Department not found', 404);
  res.json({ success: true, department: dept });
});

exports.deleteDepartment = asyncHandler(async (req, res) => {
  const dept = await Department.findByIdAndDelete(req.params.id);
  if (!dept) throw new AppError('Department not found', 404);
  res.json({ success: true, message: 'Department deleted' });
});

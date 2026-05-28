const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { extractEmbedding } = require('../services/faceRecognitionService');

exports.getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['fullName', 'avatar', 'employeeId', 'enrollmentNumber', 'branch', 'year', 'semester', 'phone'];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[`profile.${key}`] = req.body[key];
  });

  const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true });
  res.json({ success: true, user });
});

exports.registerFace = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) throw new AppError('Face image required', 400);

  const embedding = extractEmbedding(req.file.buffer);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { faceEmbedding: embedding },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Face registered for AI attendance',
    embeddingSize: embedding.length,
    user: { id: user._id, profile: user.profile },
  });
});

exports.listUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { username: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { 'profile.fullName': new RegExp(search, 'i') },
      { 'profile.enrollmentNumber': new RegExp(search, 'i') },
    ];
  }
  const users = await User.find(filter).select('-password -faceEmbedding').limit(50);
  res.json({ success: true, users });
});

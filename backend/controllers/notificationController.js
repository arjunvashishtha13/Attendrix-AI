const Notification = require('../models/Notification');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

exports.broadcast = asyncHandler(async (req, res) => {
  const { targetRole, targetDepartment, subject, message, type } = req.body;
  
  const filter = {};
  if (targetRole && targetRole !== 'all') filter.role = targetRole;
  if (targetDepartment) filter['profile.departmentRef'] = targetDepartment;

  const users = await User.find(filter).select('_id');
  if (!users.length) throw new AppError('No users found matching criteria', 404);

  const notifications = users.map(u => ({
    user: u._id,
    type: type || 'alert',
    subject,
    message,
    sent: true,
    sentAt: new Date()
  }));

  await Notification.insertMany(notifications);
  res.json({ success: true, message: `Broadcast sent to ${users.length} users` });
});

exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort('-createdAt')
    .limit(50);

  res.json({ success: true, notifications });
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  res.json({ success: true, notification });
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true }
  );
  res.json({ success: true });
});

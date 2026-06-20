const express = require('express');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const courseRoutes = require('./courseRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const exportRoutes = require('./exportRoutes');
const sessionRoutes = require('./sessionRoutes');
const notificationRoutes = require('./notificationRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/courses', courseRoutes);
router.use('/sessions', sessionRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/export', exportRoutes);
router.use('/notifications', notificationRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, service: 'Attendrix AI API', version: '1.0.0' });
});

module.exports = router;

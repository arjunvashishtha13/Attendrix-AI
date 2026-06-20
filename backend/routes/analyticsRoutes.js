const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const analyticsExtendedController = require('../controllers/analyticsExtendedController');

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/teacher-dashboard', authorize('teacher'), analyticsExtendedController.getTeacherDashboard);
router.get('/students', authorize('teacher'), analyticsExtendedController.getStudentAnalytics);
router.get('/admin', authorize('admin'), analyticsController.getAdminOverview);

module.exports = router;

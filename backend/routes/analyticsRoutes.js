const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/admin', authorize('admin'), analyticsController.getAdminOverview);

module.exports = router;

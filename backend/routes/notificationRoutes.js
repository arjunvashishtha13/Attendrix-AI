const express = require('express');
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const router = express.Router();

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);

// Admin only routes
router.post('/broadcast', authorize('admin'), notificationController.broadcast);

module.exports = router;

const express = require('express');
const multer = require('multer');
const attendanceController = require('../controllers/attendanceController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.use(authenticate);

router.get('/me', attendanceController.getMyAttendance);
router.get('/course/:courseId', attendanceController.getAttendanceByCourse);
router.post('/mark', authorize('admin', 'teacher'), attendanceController.markAttendance);
router.post('/mark-live', attendanceController.markLiveAttendance);
// router.post('/upload', authorize('admin', 'teacher'), upload.single('photo'), attendanceController.uploadAttendance);
router.post('/remind', authorize('admin', 'teacher'), attendanceController.sendReminder);

module.exports = router;

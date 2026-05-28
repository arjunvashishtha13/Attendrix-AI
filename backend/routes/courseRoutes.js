const express = require('express');
const courseController = require('../controllers/courseController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const router = express.Router();

router.use(authenticate);

router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);
router.post('/', authorize('admin', 'teacher'), courseController.createCourse);
router.patch('/:id', authorize('admin', 'teacher'), courseController.updateCourse);
router.delete('/:id', authorize('admin'), courseController.deleteCourse);
router.post('/:id/enroll', authorize('admin', 'teacher'), courseController.enrollStudent);

module.exports = router;

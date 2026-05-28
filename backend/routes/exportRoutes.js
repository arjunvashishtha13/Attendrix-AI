const express = require('express');
const exportController = require('../controllers/exportController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin', 'teacher', 'student'));

router.get('/:courseId/csv', exportController.exportCSV);
router.get('/:courseId/pdf', exportController.exportPDF);

module.exports = router;

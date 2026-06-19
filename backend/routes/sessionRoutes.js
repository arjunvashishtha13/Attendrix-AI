const express = require('express');
const sessionController = require('../controllers/sessionController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('admin', 'teacher'), sessionController.createSession);
router.get('/active/:courseId', sessionController.getActiveSession);
router.put('/:id/close', authorize('admin', 'teacher'), sessionController.closeSession);

module.exports = router;

const express = require('express');
const multer = require('multer');
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.use(authenticate);

router.get('/me', profileController.getProfile);
router.patch('/me', profileController.updateProfile);
router.post('/face', upload.single('photo'), profileController.registerFace);
router.get('/users', authorize('admin', 'teacher'), profileController.listUsers);

module.exports = router;

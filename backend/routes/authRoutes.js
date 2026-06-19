const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);
router.post('/enroll-face', authenticate, authController.enrollFace);
router.get('/oauth', authController.oauthRedirect);
router.get('/oauth/callback', authController.oauthCallback);

module.exports = router;

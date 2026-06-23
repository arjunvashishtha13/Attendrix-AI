const express = require('express');
const { 
  getUsers, createUser, updateUser, deleteUser,
  getPendingFaces, getVerificationLogs, rejectFace,
  getAnalyticsOverview,
  getCampuses, createCampus, deleteCampus
} = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

// Users
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Faces
router.get('/faces/pending', getPendingFaces);
router.get('/faces/logs', getVerificationLogs);
router.put('/faces/:id/reject', rejectFace);

// Analytics
router.get('/analytics/overview', getAnalyticsOverview);

// Settings
router.get('/campuses', getCampuses);
router.post('/campuses', createCampus);
router.delete('/campuses/:id', deleteCampus);

module.exports = router;

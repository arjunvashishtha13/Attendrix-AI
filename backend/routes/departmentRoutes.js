const express = require('express');
const { createDepartment, getDepartments, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const router = express.Router();

router.use(authenticate);

router.get('/', getDepartments);

// Only admins can modify departments
router.use(authorize('admin'));
router.post('/', createDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;

const express = require('express');
const { getStudents, getStudentById, createStudent, updateStudent } = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);
router.route('/').get(getStudents).post(authorize('admin', 'institution'), createStudent);
router.route('/:id').get(getStudentById).put(authorize('admin', 'institution'), updateStudent);

module.exports = router;

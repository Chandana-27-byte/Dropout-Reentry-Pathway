const express = require('express');
const { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);
router.route('/').get(getStudents).post(authorize('admin', 'institution'), createStudent);
router.route('/:id').get(getStudentById).put(authorize('admin', 'institution'), updateStudent).delete(authorize('admin'), deleteStudent);

module.exports = router;

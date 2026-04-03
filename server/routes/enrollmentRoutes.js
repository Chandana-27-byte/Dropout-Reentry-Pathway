const express = require('express');
const { getEnrollments, createEnrollment } = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);
router.route('/').get(getEnrollments).post(createEnrollment);

module.exports = router;

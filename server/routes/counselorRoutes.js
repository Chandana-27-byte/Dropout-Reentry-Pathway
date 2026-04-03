const express = require('express');
const { getCounselors, getCounselorById } = require('../controllers/counselorController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);
router.route('/').get(getCounselors);
router.route('/:id').get(getCounselorById);

module.exports = router;

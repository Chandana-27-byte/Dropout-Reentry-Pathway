const express = require('express');
const { getInstitutions } = require('../controllers/institutionController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.route('/')
  .get(getInstitutions);

module.exports = router;

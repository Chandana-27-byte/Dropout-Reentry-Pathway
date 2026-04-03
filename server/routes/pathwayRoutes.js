const express = require('express');
const { getPathways, getPathwayById, createPathway, getRecommendations } = require('../controllers/pathwayController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/recommend/:id', getRecommendations);

router.route('/')
  .get(getPathways)
  .post(authorize('admin', 'institution'), createPathway);

router.get('/:id', getPathwayById);

module.exports = router;

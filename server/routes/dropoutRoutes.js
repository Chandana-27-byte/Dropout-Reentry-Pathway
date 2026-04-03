const express = require('express');
const { 
  getDropouts, 
  getDropoutById, 
  recordDropout, 
  verifyDropout, 
  getDropoutStats,
  getDropoutReasons,
  getDropoutAnalysis 
} = require('../controllers/dropoutController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/stats', getDropoutStats);
router.get('/reasons', getDropoutReasons);

router.route('/')
  .get(getDropouts)
  .post(authorize('admin', 'institution'), recordDropout);

router.get('/analysis', authorize('admin', 'institution'), getDropoutAnalysis);

router.route('/:id')
  .get(getDropoutById);

router.put('/:id/verify', authorize('admin', 'counselor'), verifyDropout);

module.exports = router;

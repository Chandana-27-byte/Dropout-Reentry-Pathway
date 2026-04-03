const express = require('express');
const { 
  getDashboardStats, 
  getDropoutReport, 
  getEnrollmentReport, 
  getSuccessRateReport, 
  getDistrictWiseReport, 
  getMonthlyTrendReport 
} = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', getDashboardStats);
router.get('/dropouts', getDropoutReport);
router.get('/enrollments', getEnrollmentReport);
router.get('/success-rate', getSuccessRateReport);
router.get('/district-wise', getDistrictWiseReport);
router.get('/monthly-trend', getMonthlyTrendReport);

module.exports = router;

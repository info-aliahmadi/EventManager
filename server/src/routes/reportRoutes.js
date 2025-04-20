const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Get financial summary for dashboard
router.get('/financial-summary', reportController.getFinancialSummary);

// Get monthly performance data
router.get('/monthly-performance', reportController.getMonthlyPerformance);

// Get event performance comparison
router.get('/event-performance', reportController.getEventPerformance);

// Get expense breakdown by category
router.get('/expense-breakdown', reportController.getExpenseBreakdown);

module.exports = router; 
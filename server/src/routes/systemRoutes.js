const express = require('express');
const router = express.Router();
const databaseCheckController = require('../controllers/databaseCheckController');

// Database health check
router.get('/database/health', databaseCheckController.checkDatabaseHealth);

module.exports = router; 
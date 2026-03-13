const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/stats.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// UC-36: Manager / Admin - View statistical diagram
router.get('/', authenticate, authorize('manager', 'admin'), getStatistics);

module.exports = router;

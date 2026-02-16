const express = require('express');
const router = express.Router();
const { initSession, trackEvent, trackPulse, getAnalyticsSummary } = require('../controllers/trackingController');
const { protect } = require('../middleware/authMiddleware'); // For admin analytics

// Public Tracking Endpoints (Called by tracker.js)
router.post('/init', initSession);
router.post('/event', trackEvent);
router.post('/pulse', trackPulse);
router.post('/identify', require('../controllers/trackingController').identifyVisitor);

// Admin Analytics Endpoints
router.get('/summary', protect, getAnalyticsSummary);
router.get('/timeline', protect, require('../controllers/trackingController').getContactWebActivity);
router.get('/visitor-sessions', protect, require('../controllers/trackingController').getVisitorSessions);
router.get('/heatmap', protect, require('../controllers/trackingController').getHeatmapData);
router.get('/geo-stats', protect, require('../controllers/trackingController').getGeoStats);

module.exports = router;

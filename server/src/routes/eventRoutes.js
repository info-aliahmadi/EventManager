const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/authMiddleware');

// Get all events
router.get('/events', authenticate, eventController.getAllEvents);

// Get a specific event
router.get('/events/:id', authenticate, eventController.getEventById);

// Create a new event
router.post('/events', authenticate, eventController.createEvent);

// Update an event
router.put('/events/:id', authenticate, eventController.updateEvent);

// Delete an event
router.delete('/events/:id', authenticate, eventController.deleteEvent);

module.exports = router; 
const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');

router.post('/events', EventController.createEvent);
router.get('/events/:id', EventController.getEventById);
router.get('/users/:userId/events', EventController.getUserEvents);
router.put('/events/:id', EventController.updateEvent);
router.delete('/events/:id', EventController.deleteEvent);

module.exports = router; 
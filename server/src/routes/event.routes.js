const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/', eventController.getAllEvents);
router.get('/recommendations', verifyToken, eventController.getRecommendations);
router.post('/ai-description', verifyToken, isAdmin, eventController.generateAIDescription);
router.get('/:id', eventController.getEventById);
router.post('/', verifyToken, isAdmin, eventController.createEvent);
router.put('/:id', verifyToken, isAdmin, eventController.updateEvent);
router.delete('/:id', verifyToken, isAdmin, eventController.deleteEvent);

module.exports = router;

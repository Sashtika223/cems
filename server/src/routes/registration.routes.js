const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/:eventId', verifyToken, registrationController.registerForEvent);
router.get('/my-events', verifyToken, registrationController.getMyEvents);
router.get('/event/:eventId', verifyToken, registrationController.getEventParticipants);

module.exports = router;

const express = require('express');
const router = express.Router();
const otherController = require('../controllers/other.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, otherController.getMyNotifications);
router.put('/:id/read', verifyToken, otherController.markAsRead);

module.exports = router;

const express = require('express');
const router = express.Router();
const otherController = require('../controllers/other.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/:eventId', verifyToken, otherController.toggleBookmark);
router.get('/', verifyToken, otherController.getMyBookmarks);

module.exports = router;

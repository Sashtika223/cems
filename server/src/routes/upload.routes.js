const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/image', verifyToken, uploadController.uploadMiddleware, uploadController.uploadImage);

module.exports = router;

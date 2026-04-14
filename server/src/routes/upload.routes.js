const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const auth = require('../middleware/auth');

router.post('/image', auth, uploadController.uploadMiddleware, uploadController.uploadImage);

module.exports = router;

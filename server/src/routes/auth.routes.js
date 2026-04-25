const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', verifyToken, authController.getProfile);
router.get('/unapproved-admins', verifyToken, isAdmin, authController.getUnapprovedAdmins);
router.put('/approve-admin/:id', verifyToken, isAdmin, authController.approveAdmin);
router.delete('/reject-admin/:id', verifyToken, isAdmin, authController.rejectAdmin);

module.exports = router;

const express = require('express');
const {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
} = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;
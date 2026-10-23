const express = require('express');
const {
    registerCaptain,
    loginCaptain,
    logoutCaptain,
    getCurrentCaptain,
    toggleAvailabilty,
} = require('../controllers/Captain.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', registerCaptain);
router.post('/login', loginCaptain);
router.post('/logout', logoutCaptain);
router.get('/me', authenticateToken, getCurrentCaptain);
router.patch('/toggle-availabilty',authenticateToken, toggleAvailabilty);
module.exports = router;
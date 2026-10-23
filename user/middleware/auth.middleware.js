const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_COOKIE = 'session_token';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be configured in the environment');
}

function getToken(req) {
    const authorization = req.get('authorization');

    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.slice(7);
    }

    const cookies = req.get('cookie');
    return cookies
        ?.split(';')
        .map((cookie) => cookie.trim().split('='))
        .find(([name]) => name === SESSION_COOKIE)?.[1];
}

function authenticateToken(req, res, next) {
    const token = getToken(req);

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired authentication token' });
    }
}

module.exports = {
    authenticateToken
};

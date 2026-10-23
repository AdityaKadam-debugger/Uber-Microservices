const crypto = require('crypto');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SESSION_COOKIE = 'session_token';
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be configured in the environment');
}

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');

        crypto.scrypt(password, salt, 64, (error, derivedKey) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(`${salt}:${derivedKey.toString('hex')}`);
        });
    });
}

function verifyPassword(password, storedPassword) {
    return new Promise((resolve, reject) => {
        const [salt, key] = String(storedPassword).split(':');

        if (!salt || !key) {
            resolve(false);
            return;
        }

        crypto.scrypt(password, salt, 64, (error, derivedKey) => {
            if (error) {
                reject(error);
                return;
            }

            const storedKey = Buffer.from(key, 'hex');
            resolve(
                storedKey.length === derivedKey.length &&
                crypto.timingSafeEqual(storedKey, derivedKey)
            );
        });
    });
}

function createToken(userId) {
    return jwt.sign({ sub: userId.toString() }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
}

function setAuthCookie(res, token) {
    res.cookie(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    });
}

async function registerUser(req, res, next) {
    try {
        const { name, email, password } = req.body || {};

        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Name, email and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: await hashPassword(password)
        });

        const token = createToken(user._id);
        setAuthCookie(res, token);

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return next(error);
    }
}

async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        const passwordMatches = user
            ? await verifyPassword(password, user.password)
            : false;

        if (!user || !passwordMatches) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = createToken(user._id);
        setAuthCookie(res, token);

        return res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return next(error);
    }
}

function logoutUser(req, res) {
    res.clearCookie(SESSION_COOKIE, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json({ message: 'Logged out successfully' });
}

async function getCurrentUser(req, res, next) {
    try {
        const user = await User.findById(req.user.sub).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.send(req.user);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
};
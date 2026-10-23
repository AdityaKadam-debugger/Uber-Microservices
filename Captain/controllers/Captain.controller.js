const crypto = require('crypto');
const path = require('path');
const jwt = require('jsonwebtoken');
const CaptainModel = require('../models/Captain.model');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const SESSION_COOKIE = 'session_token';
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const { subscribeToQueue } = require('../service/rabbit')

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

function createToken(CaptainId) {
    return jwt.sign({ sub: CaptainId.toString() }, JWT_SECRET, {
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

async function registerCaptain(req, res, next) {
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
        const existingCaptain = await User.findOne({ email: normalizedEmail });

        if (existingCaptain) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        const Captain = await Captain.create({
            name: name.trim(),
            email: normalizedEmail,
            password: await hashPassword(password)
        });

        const token = createToken(Captain._id);
        setAuthCookie(res, token);

        return res.status(201).json({
            message: 'Captain registered successfully',
            token,
            user: {
                id: Captain._id,
                name: Captain.name,
                email: Captain.email
            }
        });
    } catch (error) {
        return next(error);
    }
}

async function loginCaptain(req, res, next) {
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

        const Captain = await User.findOne({ email: email.trim().toLowerCase() });
        const passwordMatches = user
            ? await verifyPassword(password, user.password)
            : false;

        if (!Captain || !passwordMatches) {
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

function logoutCaptain(req, res) {
    res.clearCookie(SESSION_COOKIE, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json({ message: 'Logged out successfully' });
}

async function getCurrentCaptain(req, res, next) {
    try {
        const Captain = await Captain.findById(req.user.sub).select('-password');

        if (!Captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        return res.status(200).json({ Captain });
    } catch (error) {
        return next(error);
    }
}

async function toggleAvailabilty(req, res, next){

    try{
        const Captain = await CaptainModel.findById(req.Captain)
        Captain.isAvailable = !Captain.isAvailable;
        await Captain.save();
        res.send(Captain);
    } catch(error) {
        res.status(500).json({ message: error.message});
    }
}

    subscribeToQueue("new-ride",(data) => {
        console.log(JSON.parse(data));
    })
module.exports = {
    registerCaptain,
    loginCaptain,
    logoutCaptain,
    getCurrentCaptain
};




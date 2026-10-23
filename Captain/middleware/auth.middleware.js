const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_COOKIE = 'session_token';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be configured in the environment');
}

async function authenticateToken(req,res,next){

    const token = req.cookie
    if(!token){
        return res.status(404).json({
            message:"Unauthorized"
        })
    }
    try{
    const verifyToken = jwt.verify(token)
    req.captain = token
    return next();
    }
    catch(err){
        return res.status(404).json({message: "Something Failed Please Try Again"})
    }
}

module.exports = {
    authenticateToken
};

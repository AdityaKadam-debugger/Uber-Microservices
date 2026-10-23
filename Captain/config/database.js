const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/uber-Captain-service';

async function connectDatabase() {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
}

module.exports = connectDatabase;

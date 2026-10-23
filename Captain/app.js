const express = require('express');
const app = express();
const captainRoutes = require('./routes/Captain.routes');
app.use(express.json());


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', captainRoutes);

module.exports = app
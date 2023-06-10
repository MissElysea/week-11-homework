const express = require('express');
const morgan = require('morgan');
const app = express();


app.use(express.json());
app.use(morgan('combined'));
const todoRoutes = require('./routes/todoRoutes');
app.use('/todos', todoRoutes);

module.exports = app;
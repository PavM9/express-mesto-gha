const express = require('express');
const { users } = require('./users');

const routes = express.Router();

routes.use('/users', users);

module.exports = { routes };

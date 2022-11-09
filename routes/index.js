const express = require('express');
const { users } = require('./users');
const { cards } = require('./cards');
const { handleError } = require('../utils/handleError');

const routes = express.Router();

routes.use('/users', users);
routes.use('/cards', cards);
routes.all('*', (req, res) => {
  const err = new Error('Неверный адрес запроса');
  err.name = 'NotFoundError';
  handleError(err, req, res);
});

module.exports = { routes };

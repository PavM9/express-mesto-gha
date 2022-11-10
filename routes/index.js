const express = require('express');
const { users } = require('./users');
const { cards } = require('./cards');
const { NOT_FOUND } = require('../utils/errorCodes');

const routes = express.Router();

routes.use('/users', users);
routes.use('/cards', cards);
routes.all('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Неверный адрес запроса' });
  return;
});

module.exports = { routes };

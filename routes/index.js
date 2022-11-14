const express = require('express');
const { users } = require('./users');
const { cards } = require('./cards');
const { NOT_FOUND } = require('../utils/errorCodes');
const { login, createUser } = require('../controllers/users');

const routes = express.Router();

routes.use(express.json());
routes.use('/users', users);
routes.use('/cards', cards);
routes.post('/signin', login);
routes.post('/signup', createUser);
routes.use('/cards', cards);
routes.all('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Неверный адрес запроса' });
});

module.exports = { routes };

const express = require('express');
const { users } = require('./users');
const { cards } = require('./cards');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { NotFoundError } = require('../utils/errors');

const routes = express.Router();

routes.all('*', express.json());

routes.post('/signin', login);
routes.post('/signup', createUser);
routes.use('/users', auth, users);
routes.use('/cards', auth, cards);
routes.all('*', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = { routes };

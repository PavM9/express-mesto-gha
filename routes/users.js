const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { validateUrl } = require('../utils/utils');

const {
  getUsers, getUserById, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

const users = express.Router();

users.get('/', getUsers);
users.get('/me', getCurrentUser);

users.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

users.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

users.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().min(2).custom(validateUrl),
    }),
  }),
  updateAvatar,
);

module.exports = { users };

const express = require('express');
const {
  getUsers, getUserById, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

const users = express.Router();

users.get('/', getUsers);
users.get('/me', getCurrentUser);
users.get('/:userId', getUserById);
users.patch('/me', updateUser);
users.patch('/me/avatar', updateAvatar);

module.exports = { users };

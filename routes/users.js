const express = require('express');
const {
  getUsers, getUserById, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

const users = express.Router();

users.get('/', getUsers);
users.get('/:userId', getUserById);
users.get('/me', getCurrentUser);
// users.post('/', express.json(), createUser);
users.patch('/me', updateUser);
users.patch('/me/avatar', updateAvatar);

module.exports = { users };

const express = require('express');
const {
  getUsers, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

const users = express.Router();

users.get('/', getUsers);
users.get('/:userId', getUserById);
// users.post('/', express.json(), createUser);
users.patch('/me', express.json(), updateUser);
users.patch('/me/avatar', express.json(), updateAvatar);

module.exports = { users };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const {
  BAD_REQUEST,
  NOT_AUTH,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} = require('../utils/errorCodes');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(NOT_AUTH).send({ message: 'Передан неверный логин или пароль' });
      return;
    }

    const hasRightPassword = await bcrypt.compare(password, user.password);

    if (!hasRightPassword) {
      res.status(NOT_AUTH).send({ message: 'Передан неверный логин или пароль' });
      return;
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretkey',
      {
        expiresIn: '7d',
      },
    );

    res.send({ jwt: token });
  } catch (err) {
    next(err);
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send('Не найдено');
  }
}

async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(NOT_FOUND).send({ message: 'Пользователь с данным _id не найден' });
      return;
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Неверный формат _id' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
}

async function createUser(req, res) {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Неверный формат данных' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Неверный формат данных' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
}

async function updateAvatar(req, res) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Неверный формат данных' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
}

module.exports = {
  login, getUsers, getUserById, createUser, updateUser, updateAvatar,
};

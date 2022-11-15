const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const {
  ConflictError,
  NotFoundError,
  AuthError,
  ValidationError,
 } = require('../utils/errors');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      next(new AuthError('Передан неверный логин или пароль'));
      return;
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      next(new AuthError('Передан неверный логин или пароль'));
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

async function getUsers(req, res, next) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(`Неверный формат данных в ${err.path ?? 'запросе'}`));
      return;
    }
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const { userId } = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(`Неверный формат данных в ${err.path ?? 'запросе'}`));
      return;
    }
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { email, password, name, about, avatar } = req.body;
    // let user = await User.findOne({ email })
    // if (user) {
    //   next(new ConflictError('Пользователь с таким логином уже зарегистрирвоан'));
    //   return;
    // }
    const hash = await bcrypt.hash(password, 10);

    let user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    // user = user.toObject();
    // delete user.password;
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      // next(new ConflictError('Пользователь с таким email уже существует'));
      // return;
      res.status(409).send({ message: 'Данный email уже есть в базе.' });
    }
    // if (err.name === 'CastError' || err.name === 'ValidationError') {
    //   next(new ValidationError(`Неверный формат данных в ${err.path ?? 'запросе'}`));
    //   return;
      // throw new ValidationError(`Неверный формат данных в ${err.path ?? 'запросе'}`);
    // } else if (err.name === 'MongoError' && err.code === 11000) {
    //   next(new ConflictError('Пользователь с таким email уже существует'));
    //   return;
    //   // throw new ConflictError('Пользователь с таким email уже существует');

    // }
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

async function updateAvatar(req, res, next) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login, getUsers, getUserById, getCurrentUser, createUser, updateUser, updateAvatar,
};

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const {
  ConflictError,
  NotFoundError,
  BadRequestError,
} = require('../utils/errors');

function login(req, res, next) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV ? JWT_SECRET : 'secretkey',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ jwt: token });
    })
    .catch(next);
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
    if (err.name === 'CastError') {
      next(new BadRequestError('Неверный формат данных в запросе'));
      return;
    }
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Неверный формат данных в запросе'));
      return;
    }
    next(err);
  }
}

async function createUser(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashPassword, name, about, avatar,
    });
    res.status(200).send({
      user: {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new ConflictError('Пользователь с таким логином уже существует'));
    } else {
      next(err);
    }
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

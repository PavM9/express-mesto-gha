const { User } = require('../models/user');

async function getUsers(req, res) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('Пользователь с данным id не найден');
      error.name = 'NotFoundError';
      throw error;
    }

    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function createUser(req, res) {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
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
    res.status(500).send({ message: err.message });
  }
}

async function updateAvatar(req, res) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

module.exports = { getUsers, getUserById, createUser, updateUser, updateAvatar };

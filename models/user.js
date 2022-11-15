const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { AuthError } = require('../utils/errors');
const { validateUrl } = require('../utils/utils');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: { validator: validateUrl, message: 'Введите корректный URL' },
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Передан неверный логин или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            return Promise.reject(new AuthError('Передан неверный логин или пароль'));
          }
          return user;
        });
    });
};

const User = mongoose.model('user', userSchema);

module.exports = { User };

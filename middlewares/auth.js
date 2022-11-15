const jsonwebtoken = require('jsonwebtoken');
const { AuthError } = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

function auth(req, res, next) {
  try {
    const { jwt } = req.cookies;

    if (!jwt) {
      next(new AuthError('Необходима авторизация'));
      return;
    }

    let payload;

    try {
      payload = jsonwebtoken.verify(jwt, NODE_ENV ? JWT_SECRET : 'secretkey');
    } catch (err) {
      throw new AuthError('Необходима авторизация');
    }

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { auth };

const jwt = require('jsonwebtoken');
const { AuthError } = require('../utils/errors');

function auth(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      next(new AuthError('Необходима авторизация'));
      return;
    }

    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, 'secretkey');
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

const jwt = require('jsonwebtoken');
const {
  BAD_REQUEST,
  NOT_AUTH,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} = require('../utils/errorCodes');

function auth(req, res, next) {
  try {
    const { authorization } = req.headers;
    console.log({ authorization });

    if (!authorization || !authorization.startsWith('Bearer ')) {
      res.status(NOT_AUTH).send({ message: 'Необходи авторизация' });
      return;
    }

    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, 'secretkey');
    } catch (err) {
      res.status(NOT_AUTH).send({ message: 'Необходима авторизация' });
    }

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { auth };

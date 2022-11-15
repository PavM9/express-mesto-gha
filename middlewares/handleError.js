// eslint-disable-next-line no-unused-vars
function handleError(err, req, res, next) {
  const { statusCode = 500 } = err;
  let { message } = err;

  if (statusCode === 500) {
    message = 'Внутренняя ошибка сервера';
  }

  res.status(statusCode).send({ message });
}

module.exports = { handleError };

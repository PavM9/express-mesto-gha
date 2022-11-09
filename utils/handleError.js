function handleError(err, req, res) {
  const BAD_REQUEST = 400;
  const INTERNAL_SERVER_ERROR = 500;
  const NOT_FOUND = 404;
  if (err.name === 'CastError') {
    res.status(BAD_REQUEST).send({
      message: 'Неверный формат данных',
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(BAD_REQUEST).send({
      message: err.message,
    });
    return;
  }

  if (err.name === 'NotFoundError') {
    res.status(NOT_FOUND).send({
      message: err.message,
    });
    return;
  }

  res.status(INTERNAL_SERVER_ERROR).send({
    message: 'Не удалось обработать запрос',
  });
}

module.exports = { handleError };

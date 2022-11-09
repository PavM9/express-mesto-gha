const express = require('express');
const mongoose = require('mongoose');
const { routes } = require('./routes');

const { PORT = 3000 } = process.env;
const DATABASE_URL = 'mongodb://localhost:27017/mestodb';

const app = express();
const bodyParser = require('body-parser');

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log(`Подключено к базе данных по адресу ${DATABASE_URL}`);
  })
  .catch((err) => {
    console.log('Ошибка подключения к базе данных');
    console.error(err);
  });

app.use((req, res, next) => {
  req.user = {
    _id: '636aea8e727ce278b4b8a33f',
  };

  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.listen(PORT, () => {
  console.log(`Приложение запущено в порте ${PORT}`);
});

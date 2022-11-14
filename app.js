const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { routes } = require('./routes');

const { PORT = 3000 } = process.env;
const DATABASE_URL = 'mongodb://localhost:27017/mestodb';

const app = express();

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log(`Подключено к базе данных по адресу ${DATABASE_URL}`);
  })
  .catch((err) => {
    console.log('Ошибка подключения к базе данных');
    console.error(err);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

app.listen(PORT, () => {
  console.log(`Приложение запущено в порте ${PORT}`);
});

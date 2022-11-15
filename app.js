const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
// require('dotenv').config();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { routes } = require('./routes');
const { handleError } = require('./middlewares/handleError');

const { PORT = 3000 } = process.env;
const DATABASE_URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(cookieParser());

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`Подключено к базе данных по адресу ${DATABASE_URL}`);
  })
  .catch((err) => {
    console.log('Ошибка подключения к базе данных');
    console.error(err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Приложение запущено в порте ${PORT}`);
});

const { Card } = require('../models/card');
const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = require('../utils/errorCodes');

async function getCards(req, res) {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send('Не найдено');
  }
}

async function createCard(req, res) {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: err.message });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send('Внутренняя ошибка сервера');
  }
}

async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);

    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      return;
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Неверный формат _id' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
}

async function likeCard(req, res) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      return;
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Неверный формат _id' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
}

async function dislikeCard(req, res) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      return;
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Неверный формат _id' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  }
}

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};

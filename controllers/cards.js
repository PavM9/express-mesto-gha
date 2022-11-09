const { Card } = require('../models/card');

async function getCards(req, res) {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function createCard(req, res) {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.send(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);

    if (!card) {
      const error = new Error('Карточка не найдена');
      error.name = 'NotFoundError';
      throw error;
    }

    res.send(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
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
      const error = new Error('Карточка не найдена');
      error.name = 'NotFoundError';
      throw error;
    }

    res.send(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
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
      const error = new Error('Карточка не найдена');
      error.name = 'NotFoundError';
      throw error;
    }

    res.send(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };

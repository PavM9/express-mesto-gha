const { Card } = require('../models/card');
const {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} = require('../utils/errors');

async function getCards(req, res, next) {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
}

async function createCard(req, res, next) {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Неверный формат данных в запросе'));
      return;
    }
    next(err);
  }
}

async function deleteCard(req, res, next) {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).populate('owner');

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    const ownerId = card.owner.id;
    const userId = req.user._id;

    if (ownerId !== userId) {
      throw new ForbiddenError('Невозможно удалить чужую карточку');
    }
    await card.remove();
    res.send(card);
  } catch (err) {
    next(err);
  }
}

async function likeCard(req, res, next) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Неверный формат данных в запросе'));
      return;
    }
    next(err);
  }
}

async function dislikeCard(req, res, next) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Неверный формат данных в запросе'));
      return;
    }
    next(err);
  }
}

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};

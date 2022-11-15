const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { validateUrl } = require('../utils/utils');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const validationConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
};

const cards = express.Router();

cards.get('/', getCards);

cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateUrl),
  }),
}), createCard);

cards.delete('/:cardId', celebrate(validationConfig), deleteCard);
cards.put('/:cardId/likes', celebrate(validationConfig), likeCard);
cards.delete('/:cardId/likes', celebrate(validationConfig), dislikeCard);

module.exports = { cards };

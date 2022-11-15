const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const validationConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom((value, err) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return err.message('Некорректный формат _id');
    }),
  }),
};

const cards = express.Router();

cards.get('/', getCards);

cards.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  createCard,
);

cards.delete('/:cardId', celebrate(validationConfig), deleteCard);
cards.put('/:cardId/likes', celebrate(validationConfig), likeCard);
cards.delete('/:cardId/likes', celebrate(validationConfig), dislikeCard);

module.exports = { cards };

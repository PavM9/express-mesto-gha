const express = require('express');
const { getCards, createCard, deleteCard, addLike, deleteLike } = require('../controllers/cards');

const cards = express.Router();

cards.get('/', getCards);
cards.post('/', express.json(), createCard);
cards.delete('/:cardId', deleteCard);
cards.put('/:cardId/likes', addLike);
cards.delete('/:cardId/likes', deleteLike);

module.exports = { cards };

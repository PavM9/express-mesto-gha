const express = require('express');
const { getCards, createCard, deleteCard } = require('../controllers/cards');

const cards = express.Router();

cards.get('/', getCards);
cards.post('/', express.json(), createCard);
cards.delete('/:cardId', deleteCard);

module.exports = { cards };

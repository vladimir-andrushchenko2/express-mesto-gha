const Card = require('../models/card');

function getCards(req, res) {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: err.message }));
}

function postCard(req, res) {
  const { name, link } = req.body;
  const { _id: owner } = req.user;

  Card.create({ name, link, owner })
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }));
}

function deleteCard(req, res) {
  Card.findByIdAndDelete(req.params['cardId'])
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }));
}

module.exports = { getCards, postCard, deleteCard };

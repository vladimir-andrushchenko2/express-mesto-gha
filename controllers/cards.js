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
  Card.findByIdAndDelete(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }));
}

function putLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }));
}

function deleteLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }));
}

module.exports = { getCards, postCard, deleteCard, putLike, deleteLike };

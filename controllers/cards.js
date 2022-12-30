const Card = require('../models/card');
const { NotFound } = require('../errorTypes');
const {
  CARD_NOT_FOUND_MSG,
} = require('../constants');
const { makeCatchHandler } = require('../utils');

function getCards(req, res) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(makeCatchHandler(res));
}

function postCard(req, res) {
  const { name, link } = req.body;
  const { _id: owner } = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(makeCatchHandler(res));
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound(CARD_NOT_FOUND_MSG);
      }

      return res.send({ data: card });
    })
    .catch(makeCatchHandler(res));
}

function updateCard(makeUpdateObj) {
  return (req, res) => {
    Card.findByIdAndUpdate(
      req.params.cardId,
      makeUpdateObj(req),
      { new: true },
    )
      .then((card) => {
        if (!card) {
          throw new NotFound(CARD_NOT_FOUND_MSG);
        }

        res.send({ data: card });
      })
      .catch(makeCatchHandler(res));
  };
}

const putLike = updateCard((req) => ({ $addToSet: { likes: req.user._id } }));

const deleteLike = updateCard((req) => ({ $pull: { likes: req.user._id } }));

module.exports = {
  getCards, postCard, deleteCard, putLike, deleteLike,
};

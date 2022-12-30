const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');
const { NotFound } = require('../errorTypes');
const {
  NOT_FOUND_CODE, BAD_REQUEST_CODE, SERVER_ERROR_CODE, SERVER_ERROR_MSG, CARD_NOT_FOUND_MSG,
} = require('../constants');

function getCards(req, res) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MSG });
    });
}

function postCard(req, res) {
  const { name, link } = req.body;
  const { _id: owner } = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
        return;
      }

      console.error(err);
      res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MSG });
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound(CARD_NOT_FOUND_MSG);
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof NotFound) {
        res.status(NOT_FOUND_CODE).send({ message: err.message });
        return;
      }

      if (err instanceof CastError) {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
        return;
      }

      console.error(err);
      res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MSG });
    });
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
      .catch((err) => {
        if (err instanceof NotFound) {
          res.status(NOT_FOUND_CODE).send({ message: err.message });
          return;
        }

        if (err instanceof CastError) {
          res.status(BAD_REQUEST_CODE).send({ message: err.message });
          return;
        }

        console.error(err);
        res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MSG });
      });
  };
}

const putLike = updateCard((req) => ({ $addToSet: { likes: req.user._id } }));

const deleteLike = updateCard((req) => ({ $pull: { likes: req.user._id } }));

module.exports = {
  getCards, postCard, deleteCard, putLike, deleteLike,
};

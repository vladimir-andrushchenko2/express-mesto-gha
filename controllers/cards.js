const Card = require('../models/card');
const { NotFound } = require('../errorTypes');

function getCards(req, res) {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: err.message }));
}

function postCard(req, res) {
  const { name, link } = req.body;
  const { _id: owner } = req.user;

  if (!owner) {
    res.status(401).send({ message: `Создание карточек доступно только для авторизованных пользователей` });
    return;
  }

  for (const entry of [name, link]) {
    if (!entry) {
      res.status(400).send({ message: `Заполните name и link для создания пользователя` });
      return;
    }
  }

  Card.create({ name, link, owner })
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }));
}

function deleteCard(req, res) {
  const { _id: owner } = req.user;

  if (!owner) {
    res.status(401).send({ message: `Удаление карточек доступно только для авторизованных пользователей` });
    return;
  }

  Card.findById(req.params.cardId)
    .then(card => {
      if (card.owner.toString() !== owner) {
        res.status(401).send({ message: `Можно удалять только свои карточки` });
        return;
      }

      return Card.findByIdAndRemove(card._id);
    })
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }));
}

function putLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(card => {
      if (!card) {
        throw new NotFound("Такой карточки не существует");
      }

      res.send({ data: card })
    })
    .catch(err => {
      if (err instanceof NotFound) {
        res.status(404).send({ message: err.message })
        return;
      }

      res.status(500).send({ message: err.message })
    });
}

function deleteLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => {
      if (!card) {
        throw new NotFound("Такой карточки не существует");
      }

      res.send({ data: card })
    })
    .catch(err => {
      if (err instanceof NotFound) {
        res.status(404).send({ message: err.message })
        return;
      }

      res.status(500).send({ message: err.message })
    });
}

module.exports = { getCards, postCard, deleteCard, putLike, deleteLike };

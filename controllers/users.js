const User = require('../models/user');
const { removeUndefinedEntries } = require('../utils');
const { NotFound } = require('../errorTypes');
const { NOT_FOUND_CODE, BAD_REQUEST_CODE, SERVER_ERROR_CODE } = require('../constants');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Запрашиваемый пользователь не найден');
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof NotFound) {
        res.status(NOT_FOUND_CODE).send({ message: err.message });
        return;
      }

      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
        return;
      }

      res.status(SERVER_ERROR_CODE).send({ message: err.message });
    });
}

function postUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: err.message });
    });
}

function patchUser(req, res) {
  const updateOptions = {
    new: true,
    runValidators: true,
  };

  const { name, about } = req.body;

  const update = removeUndefinedEntries({ name, about });

  if (!Object.keys(update).length) {
    res.status(BAD_REQUEST_CODE).send({ message: 'Заполните минимум одно поле для обновления пользователя' });
    return;
  }

  User.findByIdAndUpdate(req.user._id, update, updateOptions)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
        return;
      }

      res.status(SERVER_ERROR_CODE).send({ message: err.message });
    });
}

function patchUserAvatar(req, res) {
  const updateOptions = {
    new: true,
    runValidators: true,
  };

  const { avatar } = req.body;

  if (!avatar) {
    res.status(BAD_REQUEST_CODE).send({ message: 'Поле avatar пустое' });
    return;
  }

  User.findByIdAndUpdate(req.user._id, { avatar }, updateOptions)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
        return;
      }

      res.status(SERVER_ERROR_CODE).send({ message: err.message });
    });
}

module.exports = {
  getUsers, getUser, postUser, patchUser, patchUserAvatar,
};

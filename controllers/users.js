const { update } = require('../models/user');
const User = require('../models/user');
const { removeUndefinedEntries } = require('../utils');
const { NotFound } = require('../errorTypes');

function getUsers(req, res) {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: err.message }));
}

function getUser(req, res) {
  User.findById(req.params['userId'])
    .then(user => {
      if (!user) {
        throw new NotFound("Запрашиваемый пользователь не найден");
      }

      res.send({ data: user })
    })
    .catch(err => {
      if (err instanceof NotFound) {
        res.status(404).send({ message: err.message })
        return;
      }

      res.status(500).send({ message: err.message })
    });
}

function postUser(req, res) {
  const { name, about, avatar } = req.body;

  for (const entry of [name, about, avatar]) {
    if (!entry) {
      res.status(400).send({ message: `Заполните все поля для создания пользователя` });
      return;
    }
  }

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }));
}

function patchUser(req, res) {
  const updateOptions = {
    new: true,
    runValidators: true,
  };

  const { name, about } = req.body;

  const update = removeUndefinedEntries({ name, about });

  if (!Object.keys(update).length) {
    res.status(400).send({ message: `Заполните минимум одно поле для обновления пользователя` });
  }

  User.findByIdAndUpdate(req.user._id, update, updateOptions)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }));
}

function patchUserAvatar(req, res) {
  const updateOptions = {
    new: true,
    runValidators: true,
  };

  const { avatar } = req.body;

  if (!avatar) {
    res.status(400).send({ message: `Поле avatar пустое` });
    return;
  }

  User.findByIdAndUpdate(req.user._id, { avatar }, updateOptions)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }));
}

module.exports = { getUsers, getUser, postUser, patchUser, patchUserAvatar };

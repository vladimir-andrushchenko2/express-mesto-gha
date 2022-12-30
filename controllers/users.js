const User = require('../models/user');
const { NotFound } = require('../errorTypes');
const { USER_NOT_FOUND_MSG } = require('../constants');
const { makeCatchHandler } = require('../utils');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(makeCatchHandler(res));
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound(USER_NOT_FOUND_MSG);
      }

      res.send({ data: user });
    })
    .catch(makeCatchHandler(res));
}

function postUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(makeCatchHandler(res));
}

function patchUser(req, res) {
  const updateOptions = {
    new: true,
    runValidators: true,
  };

  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, updateOptions)
    .then((user) => {
      if (!user) {
        throw new NotFound(USER_NOT_FOUND_MSG);
      }

      res.send({ data: user });
    })
    .catch(makeCatchHandler(res));
}

function patchUserAvatar(req, res) {
  const updateOptions = {
    new: true,
    runValidators: true,
  };

  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, updateOptions)
    .then((user) => {
      if (!user) {
        throw new NotFound(USER_NOT_FOUND_MSG);
      }

      res.send({ data: user });
    })
    .catch(makeCatchHandler(res));
}

module.exports = {
  getUsers, getUser, postUser, patchUser, patchUserAvatar,
};

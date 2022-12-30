const { ValidationError, CastError } = require('mongoose').Error;
const User = require('../models/user');
const { NotFound } = require('../errorTypes');
const {
  NOT_FOUND_CODE, BAD_REQUEST_CODE, SERVER_ERROR_CODE, SERVER_ERROR_MSG, USER_NOT_FOUND_MSG,
} = require('../constants');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MSG });
    });
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound(USER_NOT_FOUND_MSG);
      }

      res.send({ data: user });
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

function postUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
        return;
      }
      console.error(err);
      res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MSG });
    });
}

function patchUser(req, res) {
  const updateOptions = {
    new: true,
    runValidators: true,
  };

  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, updateOptions)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
        return;
      }

      console.error(err);
      res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MSG });
    });
}

function patchUserAvatar(req, res) {
  const updateOptions = {
    new: true,
    runValidators: true,
  };

  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, updateOptions)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
        return;
      }

      console.error(err);
      res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MSG });
    });
}

module.exports = {
  getUsers, getUser, postUser, patchUser, patchUserAvatar,
};

const User = require('../models/user');
const { removeUndefinedEntries } = require('../utils');

function getUsers(req, res) {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: err.message }));
}

function getUser(req, res) {
  User.find({ _id: req.params['userId'] })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }));
}

function postUser(req, res) {
  const { name, about, avatar } = req.body;

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

  User.findByIdAndUpdate(req.user._id, update, updateOptions)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }));
}

module.exports = { getUsers, getUser, postUser, patchUser };

const User = require('../models/user');

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

module.exports = { getUsers, getUser, postUser };

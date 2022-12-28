const router = require('express').Router();
const { getUsers, getUser, postUser } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', postUser);

module.exports = router;

const router = require('express').Router();
const { getUsers, getUser, postUser, patchUser } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', postUser);
router.patch('/users/me', patchUser);

module.exports = router;

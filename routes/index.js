const router = require('express').Router();
const { NOT_FOUND_CODE, NOT_FOUND_MSG } = require('../constants');

router.use('/cards', require('./cards'));
router.use('/users', require('./users'));

// 404
router.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MSG });
});

module.exports = router;

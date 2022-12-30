const router = require('express').Router();

router.use('/', require('./cards'));
router.use('/', require('./users'));

module.exports = router;

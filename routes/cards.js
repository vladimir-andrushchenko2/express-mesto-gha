const router = require('express').Router();
const { getCards, postCard, deleteCard } = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', postCard);
router.delete('cards/:cardId');

module.exports = router;

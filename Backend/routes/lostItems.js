const express = require('express');
const router = express.Router();
const { getAllLostItems, createLostItem, updateLostItem, deleteLostItem } = require('../controllers/lostItemsController');

router.get('/', getAllLostItems);
router.post('/', createLostItem);
router.put('/:id', updateLostItem);
router.delete('/:id', deleteLostItem);

module.exports = router;

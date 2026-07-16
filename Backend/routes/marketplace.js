const express = require('express');
const router = express.Router();
const { getAllMarketplaceItems, createMarketplaceItem, updateMarketplaceItem, deleteMarketplaceItem } = require('../controllers/marketplaceController');

router.get('/', getAllMarketplaceItems);
router.post('/', createMarketplaceItem);
router.put('/:id', updateMarketplaceItem);
router.delete('/:id', deleteMarketplaceItem);

module.exports = router;

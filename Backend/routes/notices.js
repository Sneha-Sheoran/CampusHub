const express = require('express');
const router = express.Router();
const { getAllNotices, createNotice, updateNotice, deleteNotice } = require('../controllers/noticesController');

router.get('/', getAllNotices);
router.post('/', createNotice);
router.put('/:id', updateNotice);
router.delete('/:id', deleteNotice);

module.exports = router;

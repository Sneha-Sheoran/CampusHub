const express = require('express');
const router = express.Router();
const { getAllComplaints, createComplaint, updateComplaint, deleteComplaint } = require('../controllers/complaintsController');

router.get('/', getAllComplaints);
router.post('/', createComplaint);
router.put('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);

module.exports = router;

const express = require('express');
const { getDeliverables, createDeliverable, updateDeliverable, deleteDeliverable } = require('../controllers/deliverableController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getDeliverables).post(createDeliverable);
router.route('/:id').put(updateDeliverable).delete(deleteDeliverable);

module.exports = router;

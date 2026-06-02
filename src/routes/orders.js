const express = require('express');
const {
  createOrder,
  getOrderById,
  getOrderStatus,
  streamOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/:id/status', getOrderStatus);
router.get('/:id/stream', streamOrderStatus);
router.get('/:id', getOrderById);

module.exports = router;

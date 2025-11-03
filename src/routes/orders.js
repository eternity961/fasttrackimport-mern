const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const { createOrder, getOrdersForAdmin, getUserOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', auth, createOrder); // user places order (no payment yet)
router.get('/my', auth, getUserOrders);
router.get('/', auth, isAdmin, getOrdersForAdmin); // admin view
router.put('/:id/status', auth, isAdmin, updateOrderStatus);

module.exports = router;


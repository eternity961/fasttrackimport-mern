const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  // public route but user must be signed in (we will protect)
  const { items, shippingAddress, contactPhone } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  // compute total and snapshot product info
  let total = 0;
  const processedItems = [];
  for (const it of items) {
    const product = await Product.findById(it.product);
    if (!product) return res.status(400).json({ message: `Product not found: ${it.product}` });
    const price = product.price;
    const qty = it.quantity || 1;
    total += price * qty;
    processedItems.push({
      product: product._id,
      title: product.title,
      quantity: qty,
      price
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: processedItems,
    total,
    shippingAddress,
    contactPhone
  });

  res.status(201).json(order);
};

exports.getOrdersForAdmin = async (req, res) => {
  // admin view of all orders
  const orders = await Order.find().populate('user', 'name email phone address').sort({ createdAt: -1 });
  res.json(orders);
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  order.status = req.body.status || order.status;
  await order.save();
  res.json(order);
};


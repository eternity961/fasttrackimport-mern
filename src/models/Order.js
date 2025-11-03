const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  title: String,
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true } // snapshot price
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending','processing','completed','cancelled'], default: 'pending' },
  shippingAddress: String,
  contactPhone: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);


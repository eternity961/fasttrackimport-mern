const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const { title, description, price, stock, available } = req.body;
  const image = req.uploadedImage;
  const p = await Product.create({
    title, description, price, stock, available: available !== undefined ? available : true,
    imageUrl: image?.url, imagePublicId: image?.public_id, createdBy: req.user._id
  });
  res.status(201).json(p);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const { title, description, price, stock, available } = req.body;
  if (req.uploadedImage) {
    // optional: delete old cloudinary image (left as TODO)
    product.imageUrl = req.uploadedImage.url;
    product.imagePublicId = req.uploadedImage.public_id;
  }
  product.title = title ?? product.title;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.stock = stock ?? product.stock;
  product.available = available ?? product.available;
  await product.save();
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  // optional: delete image from cloudinary if imagePublicId exists
  res.json({ message: 'Product deleted' });
};

exports.getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
};


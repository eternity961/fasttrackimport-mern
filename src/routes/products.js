const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const { singleImageUpload } = require('../middleware/cloudinaryUpload');
const {
  createProduct, updateProduct, deleteProduct, getProducts, getProduct
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProduct);

// admin actions
router.post('/', auth, isAdmin, singleImageUpload, createProduct);
router.put('/:id', auth, isAdmin, singleImageUpload, updateProduct);
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;


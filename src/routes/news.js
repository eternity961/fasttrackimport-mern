const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const { singleImageUpload } = require('../middleware/cloudinaryUpload');
const { createNews, getAllNews, getNews, deleteNews } = require('../controllers/newsController');

router.get('/', getAllNews);
router.get('/:id', getNews);

// only admin posts news
router.post('/', auth, isAdmin, singleImageUpload, createNews);
router.delete('/:id', auth, isAdmin, deleteNews);

module.exports = router;


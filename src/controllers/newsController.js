const News = require('../models/News');

exports.createNews = async (req, res) => {
  const { title, content } = req.body;
  const image = req.uploadedImage;
  const news = await News.create({
    title, content,
    imageUrl: image?.url, imagePublicId: image?.public_id,
    postedBy: req.user._id
  });
  res.status(201).json(news);
};

exports.getAllNews = async (req, res) => {
  const news = await News.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
  res.json(news);
};

exports.getNews = async (req, res) => {
  const n = await News.findById(req.params.id).populate('postedBy', 'name email');
  if (!n) return res.status(404).json({ message: 'Not found' });
  res.json(n);
};

exports.deleteNews = async (req, res) => {
  const n = await News.findByIdAndDelete(req.params.id);
  if (!n) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'News deleted' });
};


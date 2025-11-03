const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'fasttrack' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const singleImageUpload = [
  upload.single('image'),
  async (req, res, next) => {
    if (!req.file) return next();
    try {
      const result = await uploadToCloudinary(req.file.buffer);
      req.uploadedImage = { url: result.secure_url, public_id: result.public_id };
      next();
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return res.status(500).json({ message: 'Image upload failed' });
    }
  }
];

module.exports = { singleImageUpload, cloudinary };


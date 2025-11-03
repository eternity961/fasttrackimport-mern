require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const newsRoutes = require('./routes/news');
const orderRoutes = require('./routes/orders');

const app = express();
app.use(cors());
app.use(express.json());

// connect db
connectDB().catch(err => {
  console.error('DB connection failed', err);
  process.exit(1);
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/orders', orderRoutes);

// health
app.get('/', (req, res) => res.send({ ok: true, ts: Date.now() }));

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


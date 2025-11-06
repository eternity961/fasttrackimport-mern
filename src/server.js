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

const axios = require("axios").default
app.use(cors());
app.use(express.json());

// connect db
connectDB().catch(err => {
  console.error('DB connection failed', err);
  process.exit(1);
});
const CHAPA_URL = process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize"
const CHAPA_AUTH = process.env.CHAPA_AUTH // || register to chapa and get the key
const config = {
    headers: {
        Authorization: `Bearer ${CHAPA_AUTH}`
    }
}
app.post("/api/pay", async (req, res) => {
  const CALLBACK_URL = "http://localhost:5000/api/verify-payment/";
  const RETURN_URL = "http://localhost:3000/payment-success?";
  const TEXT_REF = "tx-myecommerce12345-" + Date.now();
  const { amount, email, first_name, last_name } = req.body;

  const data = {
    amount,
    currency: "ETB",
    email,
    first_name,
    last_name,
    tx_ref: TEXT_REF,
    callback_url: CALLBACK_URL + TEXT_REF,
    return_url: `${RETURN_URL}tx_ref=${TEXT_REF}`,
  };

  try {
    const response = await axios.post(CHAPA_URL, data, config);
    res.json({ checkout_url: response.data.data.checkout_url });
  } catch (err) {
    console.error("Payment init failed:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});


// verification endpoint
app.get('/api/payment/verify/:tx_ref', async (req, res) => {
  try {
    const { tx_ref } = req.params;
    const verifyUrl = `https://api.chapa.co/v1/transaction/verify/${tx_ref}`;
    const response = await axios.get(verifyUrl, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_AUTH}` },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
});


app.get("/api/payment-success", async (req, res) => {
    res.send("Payment was successful. You can now close this page")
})


// routes
app.post("/api/webhook", express.json(), (req, res) => {
  const event = req.body;
  console.log("Webhook event:", event);
  
  if (event.status === "success") {
    // Update your database: mark order as paid
  }

  res.status(200).send("OK");
});

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


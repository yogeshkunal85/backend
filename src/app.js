const express = require('express');
const cors = require('cors');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.statusCode === 400) {
    return res.status(400).json({
      errors: [{ field: 'items', message: err.message }],
    });
  }

  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;

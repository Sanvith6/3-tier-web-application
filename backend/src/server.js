const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ message: 'API and database are reachable' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/products', productRoutes);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

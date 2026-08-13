const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');

//ENV VARIABLES
require('dotenv').config();

connectDB();

const app = express();

//Middleware
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
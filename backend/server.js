// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // <-- This is VERY important

// Connect to MongoDB
const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/arcadevault';
console.log(`✅ Connecting to MongoDB at: ${URI}`);

mongoose.connect(URI)
  .then(() => console.log('✅ MongoDB connected: localhost'))
  .catch((err) => console.error('❌ Error connecting to MongoDB:', err.message));

// Routes
app.use('/api/users', userRoutes);

// Fallback route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

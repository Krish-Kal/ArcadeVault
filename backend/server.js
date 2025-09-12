// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Allow your deployed frontend domain
const allowedOrigins = [
  'https://arcade-vault-hub.vercel.app', // your deployed frontend
  'http://localhost:5173', // local dev (optional)
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Middleware
app.use(express.json()); // parse JSON requests

// Connect to MongoDB
const URI =
  process.env.MONGO_URI ||
  'mongodb+srv://ArcadeVault:21224466@cluster0.rw2vxmz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
console.log(`✅ Connecting to MongoDB at: ${URI}`);

mongoose
  .connect(URI)
  .then(() => console.log('✅ MongoDB connected'))
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

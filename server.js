const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Loads environment variables from .env

const peopleRoutes = require('./routes/people');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Mount routes
app.use('/people', peopleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Server is running at http://localhost:${PORT}`);
});

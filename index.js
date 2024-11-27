const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./models/db');
const schoolRoutes = require('./routes/schoolRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Routes
app.use('/api', schoolRoutes);  // Define the route for school APIs

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const { connectDB } = require('./db');
const { checkAdminPage } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // We'll handle this manually if needed
  crossOriginEmbedderPolicy: false,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Admin SPA Route (must be before API/Pages so it doesn't get caught by 404s)
// /zorate serves the admin index.html
app.get('/zorate', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});
// Let the SPA handle all other /zorate/* routes
app.get('/zorate/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

// API Routes
const apiLimiter = require('./middleware/rateLimit').apiLimiter;
app.use('/api', apiLimiter); // Apply rate limiter to all APIs
app.use('/api/health', require('./routes/api/health'));
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/projects', require('./routes/api/projects'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/media', require('./routes/api/media'));

// Page Routes
const pagesRouter = require('./routes/pages');
app.use('/', pagesRouter); // Keep this last as it contains the 404 catch-all

// Start Server
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });
});
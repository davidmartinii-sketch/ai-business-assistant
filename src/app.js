const express = require('express');
const cors = require('cors');
const securityMiddleware = require('./middleware/security');
const healthRoutes = require('./routes/health');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(...securityMiddleware);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRoutes);
app.use('/', routes);

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, error: { statusCode: 404, message: 'Not Found' } });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;

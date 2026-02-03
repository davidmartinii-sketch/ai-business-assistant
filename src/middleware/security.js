const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const securityMiddleware = [
  // Set security HTTP headers
  helmet(),
  // Rate limiting: max 100 requests per 15 minutes
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  }),
];

module.exports = securityMiddleware;

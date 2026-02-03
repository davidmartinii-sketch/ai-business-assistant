const logger = require('../config/logger');

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error with request context
  const errorLog = {
    statusCode,
    message,
    path: req.path,
    method: req.method,
    url: req.url,
  };

  if (statusCode === 500) {
    logger.error(errorLog, err.stack);
  } else if (statusCode >= 400) {
    logger.warn(errorLog);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      statusCode,
      message,
    },
  });
};

module.exports = errorHandler;

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error for debugging (only in tests via special handling)
  if (statusCode === 500 && process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, err);
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

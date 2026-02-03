const pinoHttp = require('pino-http');
const logger = require('../config/logger');

const httpLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    if (res.statusCode >= 400) {
      return 'warn';
    }
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    if (res.statusCode === 404) {
      return 'request not found';
    }
    return `${req.method} completed`;
  },
  customErrorMessage: (req, res, err) => {
    return `request error: ${err.message}`;
  },
});

module.exports = httpLogger;

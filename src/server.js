require('dotenv').config();
const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');

const PORT = config.port || 3000;

// Only start server when this file is run directly (helps with testing)
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT} (${config.nodeEnv})`);
  });
}

module.exports = { start: (port = PORT) => app.listen(port) };

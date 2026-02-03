require('dotenv').config();
const app = require('./app');
const config = require('./config');

const PORT = config.port || 3000;

// Only start server when this file is run directly (helps with testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = { start: (port = PORT) => app.listen(port) };

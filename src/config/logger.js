const pino = require('pino');
const config = require('./index');

const transport =
  config.isDev || config.isTest
    ? pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      })
    : undefined;

const logger = pino(
  {
    level: process.env.LOG_LEVEL || (config.isDev ? 'debug' : 'info'),
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

module.exports = logger;

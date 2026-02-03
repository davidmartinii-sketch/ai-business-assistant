// Load environment variables first
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

// Prisma Client singleton pattern
// In Prisma 6, SQLite works directly without adapters
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  // In development/test, use appropriate logging
  prisma = new PrismaClient({
    log:
      process.env.NODE_ENV === 'test' ? ['error'] : ['query', 'error', 'warn'],
  });
}

logger.info(`Prisma Client initialized for SQLite`);

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  logger.info('Prisma client disconnected');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  logger.info('Prisma client disconnected');
  process.exit(0);
});

module.exports = prisma;

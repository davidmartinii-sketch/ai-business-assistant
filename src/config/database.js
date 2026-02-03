const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

// Prisma Client singleton pattern
// Prevents multiple instances in development with hot-reload
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
    accelerateUrl: process.env.DATABASE_URL,
  });
} else {
  // In development, use a global variable to preserve the client across hot-reloads
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
      accelerateUrl: process.env.DATABASE_URL,
    });
  }
  prisma = global.prisma;
}

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

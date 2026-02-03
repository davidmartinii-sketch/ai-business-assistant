const dotenv = require('dotenv');
const { cleanEnv, str, port } = require('envalid');

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
  DATABASE_URL: str({
    desc: 'Database connection string',
    default: 'file:./dev.db',
  }),
});

module.exports = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  databaseUrl: env.DATABASE_URL,
};

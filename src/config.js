require('dotenv').config();

module.exports = {
  FRONTEND_URL: process.env.FRONTEND_URL || null,
  DB_HOST: process.env.DB_HOST || null,
  DB_USER: process.env.DB_USER || null,
  DB_PASS: process.env.DB_PASS || null,
  DB_NAME: process.env.DB_NAME || null,
  SECRET: process.env.SECRET || 'some-secret-here',
  PORT: process.env.PORT || 3001, 
};
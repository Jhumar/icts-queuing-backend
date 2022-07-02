const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = require('../config.js');

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: DB_HOST || 'localhost',
    port: 3306,
    user: DB_USER || 'root',
    password: DB_PASS || '',
    database: DB_NAME || 'db_queuing'
  }
});

module.exports = knex;
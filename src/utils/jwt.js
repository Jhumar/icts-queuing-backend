const jwt = require('jsonwebtoken');
const { SECRET } = require('../config.js');

const sign = (payload) => {
  const access_token = jwt.sign(payload, SECRET, {
    algorithm: 'HS256',
    expiresIn: '7d'
  });

  const refresh_token = jwt.sign({ time_generated: Date.now() }, SECRET, {
    algorithm: 'HS256',
    expiresIn: '3h'
  });

  return { access_token, refresh_token };
};

module.exports = { sign };
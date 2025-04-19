const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('../config');

module.exports = rateLimit(RATE_LIMIT);

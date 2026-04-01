const path = require('path');
const { UPLOAD_DIR } = require('../config');

module.exports = (req, res, next) => {
  if (req.params[0]) {
    const safe = path.normalize(req.params[0]).replace(/^(\.\.(\/|\\|$))+/, '');
    req.safePath = path.join(UPLOAD_DIR, safe);
  }
  next();
};

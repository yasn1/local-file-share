const helmet = require('helmet');

module.exports = helmet({
  contentSecurityPolicy: false,  // gerekirse ayarla
  crossOriginEmbedderPolicy: false,
  // ... diğer helmet ayarları
});

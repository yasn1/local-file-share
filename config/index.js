require('dotenv').config();
const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  UPLOAD_DIR: path.resolve(__dirname, '..', process.env.UPLOAD_DIR || 'shared_files'),
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 100 * 1024 * 1024, // 100MB
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 dk
    max: 100
  },
  ALLOWED_MIME: [
    'image/png','image/jpeg','image/webp','image/gif',
    'video/mp4','audio/mpeg',
    'application/pdf','text/plain'
  ]
};

const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  MAX_FILE_SIZE, UPLOAD_DIR, ALLOWED_MIME
} = require('../config');
const {
  getList, download, delete: del
} = require('../controllers/filesController');
const sanitizePath = require('../middleware/sanitizePath');

// Multer ayarları
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => cb(null, file.originalname)
});
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) =>
    ALLOWED_MIME.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Yetkisiz dosya türü'))
});

// Yükle
router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.originalname });
});

// Listele
router.get('/files', getList);

// İndir
router.get('/download/*', sanitizePath, download);

// Sil
router.delete('/files/*', sanitizePath, del);

module.exports = router;

const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');

const { MAX_FILE_SIZE, UPLOAD_DIR, ALLOWED_MIME } = require('../config');
const { getList, download, delete: del } = require('../controllers/filesController');
const sanitizePath = require('../middleware/sanitizePath');

function decodeFilename(raw) {
  try {
    return Buffer.from(raw, 'latin1').toString('utf8');
  } catch {
    return raw;
  }
}

function uniqueFilename(dir, filename) {
  const ext  = path.extname(filename);
  const base = path.basename(filename, ext);
  let candidate = filename;
  let counter   = 1;
  while (fs.existsSync(path.join(dir, candidate))) {
    candidate = `${base} (${counter})${ext}`;
    counter++;
  }
  return candidate;
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),

  filename: (_req, file, cb) => {
    const decoded  = decodeFilename(file.originalname);
    const safe     = uniqueFilename(UPLOAD_DIR, decoded);
    file.savedName = safe;
    cb(null, safe);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },

  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME || ALLOWED_MIME.length === 0) return cb(null, true);
    cb(null, ALLOWED_MIME.includes(file.mimetype));
  }
});

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Dosya alınamadı.' });
  }

  const filename  = req.file.savedName || req.file.filename;
  const filesize  = req.file.size;

  console.log(`[UPLOAD] ${filename} — ${(filesize / 1048576).toFixed(2)} MB`);

  res.json({
    filename,
    size: filesize
  });
});

router.get('/files', getList);

router.get('/download/*', sanitizePath, download);

router.delete('/files/*', sanitizePath, del);

router.use((err, req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: `Dosya çok büyük. İzin verilen maksimum boyut: ${(MAX_FILE_SIZE / 1048576).toFixed(0)} MB`
    });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Beklenmeyen dosya alanı.' });
  }
  if (err.message === 'Yetkisiz dosya türü') {
    return res.status(415).json({ error: err.message });
  }
  console.error('[HATA]', err);
  res.status(500).json({ error: 'Sunucu hatası: ' + err.message });
});

module.exports = router;
const { listFiles } = require('../services/fileService');
const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR } = require('../config');

exports.getList = (req, res) => {
  res.json(listFiles());
};

exports.download = (req, res) => {
  const full = req.safePath;
  if (!full || !fs.existsSync(full)) return res.status(404).json({ error: 'Bulunamadı' });
  
  res.download(full, path.basename(full), (err) => {
    if (err && !res.headersSent) res.status(500).end();
  });
};

exports.delete = (req, res) => {
  try {
    const full = req.safePath;
    if (!full || !full.startsWith(UPLOAD_DIR)) throw new Error('Geçersiz veya yetkisiz yol');
    if (!fs.existsSync(full)) throw new Error('Bulunamadı');

    fs.unlinkSync(full);
    res.json({ deleted: req.params[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

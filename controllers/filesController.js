const { listFiles, deleteFile } = require('../services/fileService');
const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR } = require('../config');

exports.getList = (req, res) => {
  res.json(listFiles());
};

exports.download = (req, res) => {
  const rel = req.params[0];
  const full = path.join(UPLOAD_DIR, rel);
  if (!fs.existsSync(full)) return res.status(404).json({ error: 'Bulunamadı' });
  res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(rel)}`);
  fs.createReadStream(full).pipe(res);
};

exports.delete = (req, res) => {
  try {
    deleteFile(req.params[0]);
    res.json({ deleted: req.params[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

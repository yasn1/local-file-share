const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR } = require('../config');

function listFiles(dir = UPLOAD_DIR, base = '') {
  let out = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
    const full = path.join(dir, d.name);
    const rel  = base ? path.join(base, d.name) : d.name;
    if (d.isDirectory()) out = out.concat(listFiles(full, rel));
    else if (d.isFile()) out.push(rel);
  });
  return out;
}

function deleteFile(relPath) {
  const full = path.join(UPLOAD_DIR, relPath);
  if (!full.startsWith(UPLOAD_DIR)) throw new Error('Invalid path');
  fs.unlinkSync(full);
}

module.exports = { listFiles, deleteFile };

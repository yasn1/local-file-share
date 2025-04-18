// server.js
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const os      = require('os');
const multer  = require('multer');
const bonjour = require('bonjour')();

const app = express();
const port = 8008;

// Paylaşılan dosyaların kök dizini
const SHARED_DIR = path.join(__dirname, 'shared_files');

// Klasör yoksa oluştur
if (!fs.existsSync(SHARED_DIR)) {
  fs.mkdirSync(SHARED_DIR, { recursive: true });
}

// Multer ayarı: her upload SHARED_DIR içine, orijinal adla
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, SHARED_DIR),
  filename:    (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Yardımcı: diskten tüm dosyaları listeler (alt klasörler dahil) ---
function listSharedFiles(dir = SHARED_DIR, base = '') {
  let results = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const fullPath = path.join(dir, dirent.name);
    const relPath  = base ? path.join(base, dirent.name) : dirent.name;
    if (dirent.isDirectory()) {
      // Alt klasörü tara
      results = results.concat(listSharedFiles(fullPath, relPath));
    } else if (dirent.isFile()) {
      results.push(relPath);
    }
  });
  return results;
}

// --- UPLOAD (POST /upload) ---
let isUploading = false;
app.post(
  '/upload',
  (req, res, next) => {
    if (isUploading) {
      return res.status(429).json({ error: 'Başka bir yükleme devam ediyor.' });
    }
    isUploading = true;
    next();
  },
  upload.single('file'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Dosya bulunamadı.' });
      }
      res.json({ filename: req.file.originalname });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Sunucu hatası.' });
    } finally {
      isUploading = false;
    }
  }
);

// --- LIST (GET /files) ---
app.get('/files', (req, res) => {
  try {
    const files = listSharedFiles();
    res.json(files);
  } catch (err) {
    console.error('Dosya listelenirken hata:', err);
    res.status(500).json({ error: 'Dosya listesi alınamadı.' });
  }
});

// --- DOWNLOAD (GET /download/*) ---
app.get('/download/*', (req, res) => {
  // express ile route '/download/*' yazınca req.params[0] göreceğiz
  const rel = decodeURIComponent(req.params[0] || '');
  const targetPath = path.join(SHARED_DIR, rel);

  // Güvenlik: SHARED_DIR dışına çıkmayı engelle
  if (!targetPath.startsWith(SHARED_DIR)) {
    return res.status(400).json({ error: 'Geçersiz dosya yolu.' });
  }
  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
    return res.status(404).json({ error: 'Dosya bulunamadı.' });
  }

  // Türkçe karakter desteği için RFC5987 uyumlu
  res.setHeader(
    'Content-Disposition',
    `attachment; filename*=UTF-8''${encodeURIComponent(rel)}`
  );
  const stream = fs.createReadStream(targetPath);
  stream.on('error', err => {
    console.error('Stream error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Dosya okunurken hata oluştu.' });
    } else {
      res.destroy();
    }
  });
  stream.pipe(res);
});

// --- DELETE (DELETE /files/*) ---
app.delete('/files/*', (req, res) => {
  const rel = decodeURIComponent(req.params[0] || '');
  const targetPath = path.join(SHARED_DIR, rel);

  if (!targetPath.startsWith(SHARED_DIR)) {
    return res.status(400).json({ error: 'Geçersiz dosya yolu.' });
  }
  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
    return res.status(404).json({ error: 'Dosya bulunamadı.' });
  }

  try {
    fs.unlinkSync(targetPath);
    // İsterseniz boş kalan klasörleri de silebilirsiniz
    res.json({ deleted: rel });
  } catch (err) {
    console.error('Silme hatası:', err);
    res.status(500).json({ error: 'Dosya silinirken hata oldu.' });
  }
});

// mDNS ilanı
bonjour.publish({ name: 'LocalFileShare', type: 'http', port });

// Lokal IP’leri konsola yazdır
const nets = os.networkInterfaces();
Object.values(nets).flat().forEach(iface => {
  if (iface.family === 'IPv4' && !iface.internal) {
    console.log(`Erişim: http://${iface.address}:${port}`);
  }
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Server http://localhost:${port} çalışıyor`);
});

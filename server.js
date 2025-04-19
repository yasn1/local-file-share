const express = require('express');
const compression = require('compression');
const cors        = require('cors');
const morgan      = require('morgan');
const filesRouter = require('./routes/files');
const { PORT }    = require('./config');
const security    = require('./middleware/securityHeaders');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler= require('./middleware/errorHandler');
const os          = require('os');
const bonjour = require('bonjour')();

const app = express();

app.use(security);
app.use(cors());
app.use(compression());
app.use(morgan('tiny'));
app.use(rateLimiter);

app.use(express.static('public'));
app.use('/', filesRouter);

// Hata yakalayıcı
app.use(errorHandler);


function logAccessUrls() {
  const nets = os.networkInterfaces();
  console.log('🔗 LocalShare erişim URL’leri:');
  Object.entries(nets).forEach(([name, addrs]) => {
    addrs.forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`   → http://${iface.address}:${PORT}/`);
      }
    });
  });
}


logAccessUrls();
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT}`);
});

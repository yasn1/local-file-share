
module.exports = (err, req, res, next) => {
    console.error(err.stack || err);
  
    if (res.headersSent) {
      return next(err);
    }
  
    const status = err.status || err.statusCode || 500;
  
    const message = err.message || 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
  
    res.status(status).json({ error: message });
  };
  
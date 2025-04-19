
module.exports = (err, req, res, next) => {
    // Hata detayını konsola bas
    console.error(err.stack || err);
  
    // Eğer response zaten gönderildiyse, bir sonraki middleware'e ilet
    if (res.headersSent) {
      return next(err);
    }
  
    // HTTP durum kodunu hata objesinden al ya da 500 olarak belirle
    const status = err.status || err.statusCode || 500;
  
    // Kullanıcıya dönecek mesaj (genel ise özelleştirilebilir)
    const message = err.message || 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
  
    // JSON olarak hata yanıtı
    res.status(status).json({ error: message });
  };
  
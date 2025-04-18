# local-file-share
Bu proje tamamen gpt tarafınadn yazıldı (%75)

# Hakkında
Projenin amacı aynı ağa bağlı cihazların sunucuyu başlatanın cihazını kullanarak dosya alışverişi sağlamasını kolaylaştırmak.

<br>

## Kurulum
```cmd
git clone https://github.com/yasn1/local-file-share.git
```

```cmd
cd local-file-share
```

```cmd
npm install
```

```cmd
npm start
```
<br>

## Önemli
**Windows Kullananlar için:** 
windows defenderden 8008 TCP portunun ortak ağlara erişime izin vermek için yeni bir kural eklemeniz gerekiyor.
Denetim masası > Sistem Ve Güvenlik > Defender Güvenlik Duvarı > Solda gelişmiş ayarlar > Solda "Gelen Kurallar" > Sağdan "yeni kural"
- Bağlantı Noktası
- İnput kutusuna: 8008
- Bağlantıya izin ver
- ortak

<br><br><br>

**Linux kullananlar için**:
```cmd
sudo iptables -A INPUT -p tcp --dport 8008 -j ACCEPT
```

# Uyarı
Karşı taraftan olası yüklenebilecek zararlı yazılımlar için bir yapılanma kurulu değildir. Kullanırken dikkatli olun.

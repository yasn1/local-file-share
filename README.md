# Local File Share

Local File Share, aynı yerel ağa (Wi-Fi veya LAN) bağlı cihazlar arasında hızlı, kolay ve güvenli bir şekilde dosya transferi yapmanızı sağlayan Node.js tabanlı pratik bir web uygulamasıdır.

Bu proje, bulut servislerine veya harici disklere/USB belleklere ihtiyaç duymadan cihazlarınız arasında doğrudan, tarayıcı üzerinden dosya paylaşımı yapmak için tasarlanmıştır.

## Özellikler

- **Yerel Ağ Üzerinden Hızlı Transfer:** İnternet kotanızı harcamadan, modeminizin veya router'ınızın desteklediği maksimum yerel ağ hızında dosya aktarımı.
- **Güvenli Altyapı:** `helmet`, `cors` ve `express-rate-limit` gibi kütüphanelerle temel güvenlik önlemleri alınmıştır.
- **Çoklu Dosya Desteği:** `multer` ve `archiver` entegrasyonu sayesinde dosyaları veya klasörleri kolayca yükleyip indirebilirsiniz.
- **Veri Sıkıştırma:** Transferleri hızlandırmak ve sayfa yüklemelerini optimize etmek için `compression` altyapısı kullanılmıştır.
- **Çapraz Platform Çalışabilme:** Modern bir tarayıcıya sahip herhangi bir cihazdan (Telefon, Tablet, Bilgisayar, Akıllı TV) kolayca erişilebilir ve kullanılabilir. Uygulama indirmeye gerek yoktur.

## Kurulum ve Çalıştırma

Projeyi kendi ortamınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz.

### Gereksinimler
- Sisteminizde **Node.js** (v14 veya üzeri) yüklü olmalıdır.

### Kurulum
Projeyi bilgisayarınıza klonlayın ve gereksinimleri yükleyin:

```bash
git clone https://github.com/yasn1/local-file-share.git
cd local-file-share
npm install
```

### Başlatma
Sunucuyu başlatmak için komut satırında:

```bash
npm start
```
*(Geliştirici modunda nodemon ile başlatmak için `npm run dev` komutunu kullanabilirsiniz)*

Sunucu başarılı bir şekilde başladığında, terminalde uygulamanın hangi adreslerde erişime açık olduğu gösterilecektir. Yerel ağınızdaki diğer cihazların internet tarayıcılarına, sunucuyu başlatan bilgisayarın yerel ağ IP adresini (örn: `http://192.168.1.55:3000`) girerek sisteme bağlanabilirsiniz.

---

## Ağ ve Güvenlik Duvarı Ayarları (ÖNEMLİ)

Ağdaki diğer cihazların bilgisayarınızda çalışan bu sunucuya erişebilmesi için `8008` (veya `.env` dosyasından ayarladığınız) TCP portuna işletim sisteminizin güvenlik duvarından izin vermeniz gerekmektedir.

### Windows Kullanıcıları İçin
Windows Defender Güvenlik Duvarı üzerinden yeni bir "Gelen Kuralı" eklemelisiniz:

1. **Denetim Masası > Sistem ve Güvenlik > Windows Defender Güvenlik Duvarı**'nı açın.
2. Sol panelden **Gelişmiş Ayarlar**'a tıklayın.
3. Açılan pencerede sol taraftan **Gelen Kurallar**'ı (Inbound Rules) seçin.
4. Sağ panelden **Yeni Kural...** (New Rule...) seçeneğine tıklayın.
5. Kural tipi olarak **Bağlantı Noktası** (Port) seçin ve ilerleyin.
6. **TCP**'yi seçip "Belirli yerel bağlantı noktaları" kısmına `8008` yazın.
7. **Bağlantıya izin ver** (Allow the connection) seçeneğiyle ilerleyin.
8. Kuralların uygulanacağı profilleri (Özel, Ortak, Etki Alanı) kendi ağ güvenliğinize göre seçin.
9. Kurala "Local File Share Port 8008" gibi bir isim verip işlemi tamamlayın.

### Linux Kullanıcıları İçin
Terminal üzerinden `iptables` komutuyla ilgili portu erişime açabilirsiniz:

```bash
sudo iptables -A INPUT -p tcp --dport 8008 -j ACCEPT
```
*Not: İptables kurallarınızın sistem yeniden başladığında sıfırlanmaması için kuralları kaydetmeyi unutmayın. Eğer `ufw` kullanıyorsanız komut daha basittir: `sudo ufw allow 8008/tcp`*

---

## Uyarılar ve Sorumluluk Reddi

- **Güvenlik Riski:** Bu web uygulaması, sunucu tarafında herhangi bir antivirüs veya zararlı yazılım filtreleme (malware scanning) mekanizması barındırmaz. Ağınıza bağlı kullanıcıların sunucuya yüklediği veya ağdan indirilen dosyalardaki potansiyel zararlı yazırımlardan tamamen **kullanıcıların kendisi sorumludur**. Kullanırken dikkatli olunuz.
- Sisteminizi sadece **güvendiğiniz kişilerin** bulunduğu korumalı yerel ağlarda (örneğin ev veya kapalı ofis ağınızda) kullanmanız şiddetle tavsiye edilir. Ortak/halka açık Wi-Fi ağlarında (Kafeler, havalimanları vb.) çalıştırmanız risk oluşturabilir.

## Lisans
Bu proje geliştirilmeye açıktır. İhtiyaçlarınıza göre kod üzerinde değişiklik yapabilir ve kendi ağ mimarinize entegre edebilirsiniz.

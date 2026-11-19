# Hesapplar — Online Hesaplama Araçları

Hesapplar, günlük hesaplamaları tarayıcı üzerinden yapmayı sağlayan, HTML, CSS ve vanilla JavaScript ile geliştirilmiş bir web uygulamasıdır.

- **Canlı site:** https://hesapplar.com
- **Kaynak kod:** https://github.com/gkytr/hesaplaa

## Özellikler
- KDV dahil / hariç hesaplama
- İndirim ve yüzde hesaplama
- Doğum tarihinden yaş hesaplama
- Kâr / zarar hesaplama
- Uzunluk, ağırlık ve hacim birim dönüştürme
- Vücut kitle indeksi hesaplama
- Frankfurter API ile döviz kuru dönüştürme
- Mobil uyumlu arayüz

## Teknolojiler
HTML5, CSS3, Vanilla JavaScript, Fetch API ve Frankfurter döviz kuru API.

## Yerel olarak çalıştırma
1. Depoyu klonla: `git clone https://github.com/gkytr/hesaplaa.git`
2. Proje klasörünü aç.
3. `index.html` dosyasını tarayıcıda çalıştır veya VS Code Live Server kullan.

Build adımı veya paket kurulumu gerektirmez.

## Teknik notlar
- Hesaplamalar istemci tarafında JavaScript ile yapılır.
- Döviz dönüşümü için internet bağlantısı gerekir; gösterilen kur, API'nin döndürdüğü referans tarihine aittir.
- Uygulama finansal tavsiye veya resmi muhasebe belgesi üretmez.
- Kullanıcı girdileri için temel doğrulama yapılır.

## Geliştirme alanları
- Otomatik testler ve kenar durum testleri
- Erişilebilirlik kontrolleri
- Daha kapsamlı hata ve yükleniyor durumları
- Arayüz bileşenlerinin sadeleştirilmesi

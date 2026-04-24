# RN Consept - Proje Durumu ve Mimari Dokümantasyon

Bu doküman, projenin mevcut durumunu, teknoloji yığınını ve gelecek oturumlar için referans olması adına sistem mimarisini özetlemektedir.

## 1. Teknoloji Yığını (Tech Stack)
* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Wouter (Client-side routing).
* **UI Kütüphanesi:** shadcn/ui (Radix UI tabanlı erişilebilir bileşenler), Lucide React (İkonlar).
* **State Management & Veri Çekme:** TanStack React Query (useQuery, useMutation).
* **Backend:** Saf Node.js (`http` modülü). Herhangi bir framework (Express vb.) kullanılmamaktadır.
* **Veritabanı:** Yerel JSON dosyası (`server/data.json`).
* **Dosya Yönetimi:** Yüklenen görseller `Taslak/public/uploads/` dizininde saklanmakta ve doğrudan Node.js üzerinden statik olarak servis edilmektedir.

## 2. Proje Yapısı (Klasör Mimarisi)

```text
RnWeb/
├── server/
│   └── data.json           # Projenin tek veritabanı (Kategoriler, Kumaşlar, Ürünler)
├── PROJE_DURUMU.md         # (Bu dosya)
└── Taslak/
    ├── public/
    │   ├── images/         # Sabit site görselleri (logo, banner vb.)
    │   ├── videos/         # Arka plan videoları
    │   └── uploads/        # Admin panelinden yüklenen dinamik ürün görselleri
    ├── src/
    │   ├── components/     # Tekrar kullanılabilir React bileşenleri (Navbar, FabricSidePanel)
    │   ├── lib/            # api.ts (Backend iletişim metodları), utils.ts (Tailwind merge)
    │   ├── pages/
    │   │   ├── admin/      # Admin paneli (Dashboard, Ürün Yönetimi, Kumaş Yönetimi)
    │   │   ├── categories/ # Kategori detay sayfası
    │   │   ├── product/    # Tekil ürün detay ve özelleştirme sayfası
    │   │   ├── home.tsx    # Anasayfa (Landing Page)
    │   │   └── not-found.tsx # 404 Sayfası
    │   ├── App.tsx         # Ana routing (Wouter)
    │   ├── index.css       # Global stiller ve Tailwind direktifleri
    │   └── main.tsx        # React başlangıç noktası
    ├── server.js           # Node.js backend API sunucusu (Port 3001)
    └── vite.config.ts      # Vite ayarları (Proxy yönlendirmeleri vs.)
```

## 3. Mevcut Özellikler ve Modüller

### A. Müşteri Arayüzü (Frontend)
* **Dinamik Anasayfa:** Framer motion ile animasyonlu geçişler, öne çıkan ürünler, kategoriler ve marka felsefesi.
* **Kategori Listeleme:** Belirli bir kategoriye (Örn: Salon, Bahçe) ait yayındaki ürünlerin listelenmesi (`/categories/:slug`).
* **Ürün Detay Sayfası:** (`/product/:id`)
  * Ürün fotoğrafları galerisi.
  * Dinamik Kumaş Seçici: Sağdan açılan çekmece (Drawer) panel üzerinden (Admin'den girilen) kumaşları seçme imkanı.
  * Dinamik Fiyat Hesaplama: Ürünün taban fiyatı (çerçeve) + (Kumaşın m² fiyatı * Ürünün m² ihtiyacı).
  * Miktar seçici ve Sepete Ekle simülasyonu.

### B. Admin Paneli (`/admin`)
* **Ürün Yönetimi:**
  * Ürün Ekleme/Düzenleme/Silme.
  * **Gizli Üretici Bilgileri:** Tedarikçi adı, irtibat ve gizli notlar (Sadece admin görür).
  * **Gelişmiş Görsel Yükleme:** Cihazdan doğrudan upload. İlk yüklenen resim "Hero" (Kapak) görseli olarak ayarlanır. Seçilen resimlerin anında önizlemesi ve çöp kutusu ile silinebilmesi.
* **Kumaş Yönetimi:**
  * Sisteme yeni kumaş ekleme, m² fiyatı belirleme, aktif/pasif durumunu ayarlama ve silme özelliği.

## 4. Backend API Rotaları (`server.js`)
Backend 3001 portunda çalışır. Vite (5173), `/api` ve `/uploads` isteklerini bu porta proxy (yönlendirme) yapar.

* **GET /uploads/*:** Yüklenen görselleri statik olarak doğrudan servis eder.
* **GET, POST, PUT, DELETE /api/products:** Ürün arşivi (CRUD). POST işleminde benzersiz `p...` kimliği (ID) oluşturulur.
* **GET, POST, PUT, DELETE /api/fabrics:** Kumaş arşivi (CRUD). POST işleminde benzersiz `f...` kimliği oluşturulur.
* **GET /api/categories:** Sabit kategorileri getirir.
* **POST /api/upload:** Base64 formatında gelen dosyayı parse eder, `public/uploads` içine kaydeder ve erişilebilir URL'yi (`/uploads/dosya-adi.webp`) döndürür.

## 5. Çözülen Önemli Sorunlar
* **ID Senkronizasyon Bug'ı:** Yeni ürün eklenirken frontend'den gelen boş ID'nin backend tarafından kabul edilip rotaların çökmesi (404 Page Not Found) sorunu çözüldü. Backend artık boş gelen ID'leri ezip otomatik atama yapmaktadır.
* **Resim Gözükmeme Bug'ı:** Vite dev sunucusunun anlık eklenen görselleri tanımayıp HTML (NotFound) döndürmesi sorunu, `vite.config.ts` içerisine `/uploads` proxy'si eklenerek ve `server.js`'te GET işlemlerinin en başa alınmasıyla kalıcı olarak çözüldü.
* **Kategori Eşleşme:** Admin'den eklenen ürünlerin "c1" gibi hatalı ID varsayılanları yerine gerçek kategori ID'lerini ("1") alması sağlandı.

## 6. Gelecek Oturumda Yapılacaklar (Next Steps)
1. **Yapay Zeka (AI) Kumaş Giydirme:** Admin panelinden veya frontend'den seçilen kumaş deseninin, ürünün Hero (Kapak) görseline dinamik olarak entegre edilmesi için bir API veya kütüphane bağlantısının kurulması.
2. **Admin Güvenliği:** `/admin` rotalarına erişim için basit bir yetkilendirme (şifre ekranı) mekanizması eklenmesi.
3. **Veritabanı Geçişi:** JSON tabanlı sistemin tamamen Firebase, Supabase veya PostgreSQL gibi profesyonel bir veritabanına taşınması (İsteğe bağlı).

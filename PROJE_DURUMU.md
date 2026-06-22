# RN Consept - Proje Durumu ve Mimari Dokümantasyon

Bu doküman, projenin mevcut durumunu, teknoloji yığınını ve gelecek oturumlar için referans olması adına sistem mimarisini özetlemektedir.

## 1. Teknoloji Yığını (Tech Stack)
* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Wouter (Client-side routing).
* **UI Kütüphanesi:** shadcn/ui (Radix UI tabanlı erişilebilir bileşenler), Lucide React (İkonlar).
* **State Management & Veri Çekme:** TanStack React Query (useQuery, useMutation), Context API (Auth, Cart, Favorites).
* **Backend & Veritabanı:** Firebase (Firestore veritabanı, Firebase Storage dosya yönetimi). Sunucusuz (Serverless) mimari aktif.
* **Dosya Yönetimi:** Yüklenen görseller doğrudan Firebase Storage üzerine `uploads/` dizinine yüklenir.

## 2. Proje Yapısı (Klasör Mimarisi)

```text
RnWeb/
├── PROJE_DURUMU.md         # (Bu dosya)
└── Taslak/
    ├── public/
    │   ├── images/         # Sabit site görselleri (logo, banner vb.)
    │   └── videos/         # Arka plan videoları
    ├── src/
    │   ├── components/     # Tekrar kullanılabilir React bileşenleri (Navbar, Footer, FabricSidePanel, ProfileLayout)
    │   ├── contexts/       # Global State Yönetimleri (AuthContext, CartContext, FavoritesContext)
    │   ├── lib/            # api.ts (Firebase iletişim metodları), firebase.ts (Firebase konfigürasyonu)
    │   ├── pages/
    │   │   ├── admin/      # Admin paneli (Dashboard, Ürün/Kumaş Yönetimi, vb.)
    │   │   ├── auth/       # Üye Kayıt, Giriş
    │   │   ├── categories/ # Kategori detay sayfası
    │   │   ├── product/    # Tekil ürün detay ve özelleştirme sayfası
    │   │   ├── profile/    # Müşteri paneli (Hesabım, Adresler, Favoriler vb.)
    │   │   ├── Cart.tsx    # Gelişmiş, yatay tasarımlı alışveriş sepeti ve ödeme adımları
    │   │   ├── Home.tsx    # Anasayfa (Landing Page)
    │   │   └── not-found.tsx # 404 Sayfası
    │   ├── App.tsx         # Ana routing (Wouter)
    │   ├── index.css       # Global stiller ve Tailwind direktifleri
    │   └── main.tsx        # React başlangıç noktası
    └── vite.config.ts      # Vite ayarları
```

## 3. Mevcut Özellikler ve Modüller

### A. Müşteri Arayüzü (Frontend)
* **Kullanıcı Doğrulama & Hesap (`/profile`):** Firebase Auth ile çalışan tam fonksiyonel müşteri profili.
  * **Favoriler:** Firebase destekli Favori listesi, misafir kullanıcılar için LocalStorage hibrit yaklaşımı. Profil sayfasında ve menülerde entegre.
  * **Adresler:** Kullanıcı bazlı çalışan Adres Defteri. Yeni adres ekleme, görüntüleme ve Firebase üzerinde saklama özellikleri aktif.
* **Sepet ve Ödeme (Checkout):** 
  * Premium, yatay liste (horizontal) görünümlü modern sepet arayüzü.
  * Ücretsiz Teslimat, Teslimat Süresi (Hafta) ve Ücretsiz/Ücretli Kurulum bilgileri doğrudan sepette görselleştirilir.
  * Kayıtlı adresleri seçme veya hızlıca yeni adres girme modülü eklendi.
  * Havale/EFT ve Kredi Kartı ödeme tipleri arayüzleri hazır (Sanal POS entegrasyonu aşamasında).
* **Modüler Ürün Detay Sayfası (`/product/:id`):**
  * Takım (Set) veya Tekil Modül olarak ürün listeleme. Dinamik takım fiyat ve kumaş konfigüratörü.
  * Admin panelinden atanan özel teslimat süresi ve ücretsiz kurulum özellikleri ürün sayfasında gösterilir.

### B. Admin Paneli (`/admin`)
* **Ürün Yönetimi:** Modüler parça bazlı ürün girişleri, fiyatlama ve özellikleri belirleme. Yeni güncelleme ile "Ücretsiz Kurulum Logosu" ve "Teslimat Süresi (Hafta)" ekleme/çıkarma özellikleri sisteme dahil edilmiştir.
* **Kumaş Yönetimi:** Aktif/pasif yapılabilen global kumaş yönetimi sistemi.

## 4. Backend & Veri Yapısı (Firebase)
* Tamamen Serverless bir yapı kurulmuştur (`api.ts`).
* Adresler (`addresses` koleksiyonu), Siparişler (`orders` koleksiyonu), Sepetler (`carts` koleksiyonu) ve Favoriler veritabanına bağlanmıştır.
* **Güvenlik Kuralları (Security Rules):** Firestore (`firestore.rules`) ve Storage (`storage.rules`) güvenlik kuralları projeye entegre edilmiştir:
  * Ürünler, Kategoriler ve Kumaşlar genel erişime açık (Read) olup sadece admin (`admin@rnconsept.com`) tarafından yazılabilir.
  * Siparişler, Adresler, Sepetler ve Favoriler ise ilgili kullanıcının kendi UID'sine göre yetkilendirilmiştir; her kullanıcı yalnızca kendi verisine erişebilir.

## 5. Çözülen Önemli Sorunlar
* **Veritabanı Erişim İzinleri Hatası (Permission Denied):** Firebase test modu süresinin (30 gün) dolması nedeniyle kapanan veritabanı erişimi, hazırlanan güvenlik kuralları ile kalıcı ve güvenli olarak tekrar aktif edilmiştir.
* **Sepet UI UX Problemleri:** Ürünlerin sepette kocaman resimlerle dağınık görünmesi engellendi, tek bir çizgi üzerinde şık listeler haline getirildi.
* **Müşteri - Admin Ayrımı:** Firebase ile müşteri bilgileri güvenli bir profilde (`addresses`) tutularak yönetimi sağlandı, yetkilendirmeler oluşturuldu.
* **Kalıcı Context Yönetimi:** Sepet ve favori sistemleri global contextlere bağlanıp proje genelinde erişilebilir kılındı.

## 6. Gelecek Oturumda Yapılacaklar (Next Steps)
1. **Sanal POS Entegrasyonu:** Sepette "Kredi Kartı" seçimi sonrası Iyzico veya benzeri bir ödeme altyapısıyla işlemlerin gerçekleştirilmesi.
2. **Sipariş Bildirim Sistemi:** Yeni bir sipariş alındığında veya durumu değiştiğinde (`orders` koleksiyonu) hem kullanıcıya hem de yöneticiye E-Posta veya sistem üzerinden bilgilendirme gönderilmesi.
3. **Admin Sipariş Paneli:** Gelen siparişlerin durumlarını (Hazırlanıyor, Kargoya Verildi vs.) değiştirebileceğimiz ve adres bilgisiyle görebileceğimiz bir Admin Listeleme Sayfasının yapılması.

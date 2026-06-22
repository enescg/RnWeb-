# RnWeb Project Rules & Learnings

## 1. Product Details Customization Page (`src/pages/product/[slug].tsx`)

### Fabric Selection Card Sizing & Rules (CRITICAL)
- **Fabric Cards Sizing:**
  - Card Width: `w-[100px] sm:w-[120px]` (Mobile: 100px, Desktop: 120px)
  - Image Height: `h-[70px] sm:h-[85px]` (Mobile: 70px, Desktop: 85px)
  - Card Padding: `p-2`
  - Check Badge: `<Check size={8} className="stroke-[3]" />` placed at `top-1 right-1` inside a `bg-primary text-white p-0.5 rounded-full shadow-sm` container.
- **Fabric Card Typography:**
  - Fabric Name: `text-[10px] sm:text-[11px]`
  - Price Difference text: `text-[9px] sm:text-[10px]`
  - Selection Button: `text-[9px] sm:text-[10px] py-1` height, with margin `mt-1.5`.
- **Navigation & Scrolling:**
  - Scroll Arrow buttons scrollBy distance: exactly `115` (`left: -115` and `left: 115`).
  - **NO AUTO-SCROLL:** Do NOT use `scrollIntoView` or automatic window scrolls when selecting a fabric or leg option, when clicking customized option buttons, or when clicking "Geri Dön" back buttons. The page scroll position must remain static during these actions.

### Leg Selection Configuration
- **Ayak Malzeme & Renk Çiftleri:**
  - **Ahşap Ayak:** Meşe ve Siyah ("Ahşap Meşe", "Ahşap Siyah")
  - **Metal Ayak:** Siyah ve Altın ("Metal Siyah", "Metal Altın")
- **Varsayılan Seçim:** Ayak bilgisi girilmediğinde veya seçilmediğinde varsayılan olarak **"Ahşap Meşe"** seçilmiş sayılır.

---

## 2. Navigasyon & Global Menü (`src/components/Navbar.tsx`)
- **Mobil Menü Hamburger Açılışı:** Hamburger mobil menüsü tüm sayfalarda (ürün, kategori vb.) kusursuz çalışmalıdır, sadece anasayfaya bağımlı bırakılmamalıdır.

---

## 3. Deployment & Build Commands
- **Local Dev Server:** Stop dev server before finishing.
- **Production Build Check:** Always run `npm run build` to verify compile safety.
- **Firebase Deployment Command:** `npx firebase-tools deploy --only hosting` (Deploys target `rnweb-74833` which points to `rnconsept.com` custom domain).
- **Git Commit & Push:** Ensure all changes are added, committed, and pushed to origin main at the end of the session.

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Menu, X, MapPin, Phone, Instagram, Facebook, Twitter, Check, ShoppingBag, Heart, Trash2, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { fetchCategories, fetchProducts } from "@/lib/api";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// --- Components ---

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative h-[100dvh] overflow-hidden bg-secondary">
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h2 className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-white/80">
            Beylikdüzü, İstanbul
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-10 max-w-4xl leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400 }}>
            Zamanın Ötesinde Yaşam Alanınıza <br />
            <span className="text-white/90">Birlikte İmza Atıyoruz</span>
          </h1>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <a
              href="#koleksiyonlar"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-primary border border-white/40 hover:border-primary text-white px-6 py-3.5 transition-all duration-300 font-medium uppercase tracking-wider text-xs group backdrop-blur-sm"
              data-testid="link-indoor"
            >
              <span>Indoor Koleksiyonu Keşfedin</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#koleksiyonlar"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-primary border border-white/40 hover:border-primary text-white px-6 py-3.5 transition-all duration-300 font-medium uppercase tracking-wider text-xs group backdrop-blur-sm"
              data-testid="link-outdoor"
            >
              <span>Outdoor Koleksiyonu Keşfedin</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#koleksiyonlar"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-primary border border-white/40 hover:border-primary text-white px-6 py-3.5 transition-all duration-300 font-medium uppercase tracking-wider text-xs group backdrop-blur-sm"
              data-testid="link-mutfak"
            >
              <span>Mutfak Çözümlerini Keşfedin</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};



const Categories = () => {
  const { data: dbCategories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const categories = dbCategories?.map((cat: any) => ({
    id: cat.id,
    slug: cat.slug,
    title: cat.name,
    desc: cat.slug === 'salon' ? "İhtişam ve konforun kusursuz dengesi." : 
          cat.slug === 'bahce' ? "Doğayla bütünleşen lüks dış mekan deneyimi." : 
          "Estetik ve işlevselliğin buluştuğu yaşam alanları.",
    img: cat.slug === 'salon' ? "/images/living-room.png" : 
         cat.slug === 'bahce' ? "/images/garden.png" : "/images/kitchen.png"
  })) || [];

  return (
    <section className="py-24 section-gradient-alt" id="koleksiyonlar">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24"
        >
          <span className="text-primary uppercase tracking-widest text-sm font-semibold block mb-4">Koleksiyonlarımız</span>
          <h2 className="text-4xl md:text-6xl font-serif text-foreground">Yaşam Alanlarınızı <br />Yeniden Tanımlayın.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group cursor-pointer"
              data-testid={`card-category-${cat.id}`}
            >
              <Link href={`/categories/${cat.slug}`} className="block w-full h-full">
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-primary/15 transition-colors duration-500 z-10" />
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="relative pb-4">
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full bg-primary transition-all duration-500 ease-out" />
                  <h3 className="text-2xl font-serif mb-2 group-hover:text-primary transition-colors duration-300">{cat.title}</h3>
                  <p className="text-foreground/60 group-hover:text-primary/70 font-light transition-colors duration-300">{cat.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Customization = () => {
  const [activeTab, setActiveTab] = useState('kumas');

  return (
    <section className="py-24 md:py-32 section-gradient" id="ozellestirme">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-primary uppercase tracking-widest text-sm font-semibold block mb-4">Size Özel</span>
              <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-8">Kişiselleştirilmiş <br />Lüks Deneyimi.</h2>
              <p className="text-lg text-foreground/70 font-light mb-12">
                RN Consept'te hiçbir parça birbirinin aynısı olmak zorunda değil. Kendi tarzınızı yansıtmanız için en ince detaylara kadar özelleştirme imkanı sunuyoruz. Dünyanın dört bir yanından özenle seçilmiş birinci sınıf materyaller parmaklarınızın ucunda.
              </p>

              <div className="flex space-x-8 border-b border-border mb-8">
                <button
                  onClick={() => setActiveTab('kumas')}
                  className={`pb-4 text-lg font-serif transition-colors relative ${activeTab === 'kumas' ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/70'}`}
                  data-testid="tab-kumas"
                >
                  Kumaş Seçenekleri
                  {activeTab === 'kumas' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('ahsap')}
                  className={`pb-4 text-lg font-serif transition-colors relative ${activeTab === 'ahsap' ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/70'}`}
                  data-testid="tab-ahsap"
                >
                  Ahşap ve Cila
                  {activeTab === 'ahsap' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
                  )}
                </button>
              </div>

              <div className="min-h-[150px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'kumas' && (
                    <motion.div
                      key="kumas"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-foreground/70 font-light mb-6">
                        Dokunuşuyla büyüleyen İtalyan kadifesi, doğal nefes alan ketenler, modern dokulu bouclé ve özenle işlenmiş hakiki deri seçenekleriyle mobilyanızı ruh halinize göre giydirin.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 border border-border text-sm font-light">Kadife</span>
                        <span className="px-4 py-2 border border-border text-sm font-light">Keten</span>
                        <span className="px-4 py-2 border border-border text-sm font-light">Bouclé</span>
                        <span className="px-4 py-2 border border-border text-sm font-light">Deri</span>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'ahsap' && (
                    <motion.div
                      key="ahsap"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-foreground/70 font-light mb-6">
                        Doğanın eşsiz damar yapısını koruyan sıcak ceviz, modern mekanlar için mat meşe, dramatik bir etki için abanoz ve ferah tasarımlar için beyazlatılmış masif ahşap bitişleri.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 border border-border text-sm font-light">Ceviz</span>
                        <span className="px-4 py-2 border border-border text-sm font-light">Meşe</span>
                        <span className="px-4 py-2 border border-border text-sm font-light">Abanoz</span>
                        <span className="px-4 py-2 border border-border text-sm font-light">Beyazlatılmış Ahşap</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </div>

          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={activeTab === 'kumas' ? "/images/fabric-detail.png" : "/images/wood-detail.png"}
                  alt={activeTab === 'kumas' ? "Kumaş Seçenekleri" : "Ahşap Seçenekleri"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Craftsmanship = () => {
  return (
    <section className="py-24 overflow-hidden section-gradient-alt" id="zanaat">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-primary uppercase tracking-widest text-sm font-semibold block mb-4">Ustalık</span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8">El İşçiliğinin <br />Asil Yankısı.</h2>
              <p className="text-lg text-foreground/70 font-light mb-8">
                Makinelerin üretemediği o eşsiz dokunuşu, ustalarımızın tecrübesiyle şekillendiriyoruz. Her bir RN Consept mobilyası, ahşabın kesiminden kumaşın dikimine kadar titiz bir el işçiliğinin eseridir.
              </p>

              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-foreground/80 font-light">
                  <div className="w-6 h-6 rounded-full border border-primary flex items-center justify-center text-primary">
                    <Check size={12} />
                  </div>
                  <span>Geleneksel Türk marangozluk teknikleri</span>
                </li>
                <li className="flex items-center space-x-3 text-foreground/80 font-light">
                  <div className="w-6 h-6 rounded-full border border-primary flex items-center justify-center text-primary">
                    <Check size={12} />
                  </div>
                  <span>Birinci sınıf malzeme seçimi ve kalite kontrolü</span>
                </li>
                <li className="flex items-center space-x-3 text-foreground/80 font-light">
                  <div className="w-6 h-6 rounded-full border border-primary flex items-center justify-center text-primary">
                    <Check size={12} />
                  </div>
                  <span>Sürdürülebilir ve doğa dostu üretim süreçleri</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] max-w-md mx-auto lg:ml-0"
            >
              <img
                src="/images/wood-detail.png"
                alt="Ustalık ve Zanaat"
                className="w-full h-full object-cover grayscale-[30%] brightness-90"
              />
              <div className="absolute -bottom-6 -right-6 md:-bottom-12 md:-right-12 w-48 h-48 section-gradient p-4 hidden md:block">
                <img src="/images/fabric-detail.png" alt="Detay" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturedPieces = () => {
  const { data: dbProducts } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: dbCategories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const pieces = dbProducts?.filter((p: any) => p.is_published && p.is_featured).map((p: any) => ({
    id: p.id,
    name: p.title,
    category: dbCategories?.find((c: any) => c.id === p.category_id)?.name || "Kategori",
    material: p.description?.substring(0, 40) + "..." || "",
    price: (p.base_price_without_fabric * 1.1).toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + " TL",
    discountedPrice: p.base_price_without_fabric.toLocaleString('tr-TR') + " TL",
    img: p.images?.[0] || "/images/living-room.png",
    isFreeShipping: p.is_free_shipping !== false
  })) || [];

  return (
    <section className="py-24 section-gradient" id="one-cikanlar">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary uppercase tracking-widest text-sm font-semibold block mb-4">Öne Çıkanlar</span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">İmza Parçalar</h2>
          </motion.div>
          <motion.a
            href="#koleksiyonlar"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:flex items-center space-x-2 text-foreground hover:text-primary transition-colors uppercase tracking-widest text-sm font-medium"
            data-testid="link-view-all"
          >
            <span>Tümünü Gör</span>
            <ChevronRight size={16} />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pieces.length > 0 ? (
            pieces.map((piece, index) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group"
                data-testid={`card-featured-${piece.id}`}
              >
              <Link href={`/product/${piece.id}`} className="block relative aspect-square overflow-hidden mb-6 bg-card cursor-pointer">
                <img
                  src={piece.img}
                  alt={piece.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 z-20">
                  <span className="text-white border-b border-white/50 pb-1 hover:border-white transition-colors text-sm uppercase tracking-widest">
                    Özelleştir / İncele
                  </span>
                </div>
              </Link>
              <div className="px-1 mt-3">
                <h3 className="text-3xl font-sans font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">{piece.name}</h3>
                <div className="flex flex-col mb-3">
                    <span className="text-rose-600 font-medium text-lg">
                        {piece.price}
                    </span>
                    <span className="text-rose-800 font-bold text-xl">
                        Sepette: {piece.discountedPrice}
                    </span>
                </div>
                {piece.isFreeShipping && (
                  <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md w-fit font-medium">
                      <Truck size={14} />
                      <span>Ücretsiz Teslimat</span>
                  </div>
                )}
              </div>
            </motion.div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center py-12">
              <p className="text-foreground/50 font-light text-lg">Henüz öne çıkan ürün belirlenmedi. Admin panelinden ürünlerinizi öne çıkarabilirsiniz.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Showroom = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary text-secondary-foreground text-center relative overflow-hidden" id="showroom">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img src="/images/hero.png" alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <MapPin size={40} className="mx-auto mb-8 text-primary" strokeWidth={1} />
          <h2 className="text-4xl md:text-6xl font-serif mb-6">Sizi Bekliyoruz</h2>
          <p className="text-lg md:text-xl font-light text-secondary-foreground/70 mb-12">
            Koleksiyonlarımızı yakından incelemek, kahvenizi yudumlarken hayalinizdeki mobilyayı tasarlamak için sizi Nişantaşı'ndaki showroom'umuza davet ediyoruz.
          </p>
          <div className="flex flex-col items-center space-y-6">
            <p className="font-serif text-xl tracking-wide uppercase">Abdi İpekçi Caddesi No: 42<br />Nişantaşı, Şişli / İstanbul</p>
            <div className="w-16 h-[1px] bg-primary/50" />
            <a href="tel:+902120000000" className="flex items-center space-x-3 text-primary hover:text-white transition-colors text-lg" data-testid="link-phone">
              <Phone size={20} />
              <span className="tracking-widest">+90 (212) 000 00 00</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};



export default function Home() {
  return (
    <main className="min-h-screen font-sans overflow-x-hidden selection:bg-primary/30 selection:text-foreground">
      <Navbar />
      <Hero />
      <FeaturedPieces />
      <Categories />
      <Craftsmanship />
      <Customization />
      <Showroom />
      <Footer />
    </main>
  );
}

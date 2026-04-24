import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Menu, X, MapPin, Phone, Instagram, Facebook, Twitter, Check, ShoppingBag, Heart, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProducts } from "@/lib/api";

// --- Components ---

// Sample selections data
const sampleSelections = [
  {
    id: 1,
    name: "Bosphorus Kanepe",
    category: "Salon Takımları",
    config: "Kadife · Koyu Ceviz",
    img: "/images/living-room.png",
  },
  {
    id: 2,
    name: "Pera Dış Mekan Seti",
    category: "Bahçe Mobilyaları",
    config: "Tik Ağacı · Açık Keten",
    img: "/images/garden.png",
  },
];

const SelectionsPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [items, setItems] = useState(sampleSelections);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            data-testid="overlay-selections"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-full w-full max-w-md z-[80] flex flex-col"
            style={{ background: "radial-gradient(ellipse at 38% 35%, hsl(43 22% 68%) 0%, hsl(43 16% 54%) 42%, hsl(43 12% 42%) 100%)" }}
            data-testid="panel-selections"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-7 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <ShoppingBag size={22} className="text-primary" />
                <h2 className="text-lg font-serif tracking-[0.2em] uppercase text-foreground">
                  Seçtikleriniz
                </h2>
                {items.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-foreground/60 hover:text-foreground transition-colors"
                data-testid="button-close-selections"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <Heart size={48} className="text-foreground/20 mb-6" />
                  <p className="text-foreground/60 font-light text-sm leading-relaxed">
                    Henüz bir seçim yapmadınız.<br />
                    Koleksiyonlarımızı keşfedip<br />beğendiklerinizi ekleyin.
                  </p>
                  <a
                    href="#koleksiyonlar"
                    onClick={onClose}
                    className="mt-8 inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-primary/90 transition-colors"
                  >
                    <span>Koleksiyonlara Git</span>
                    <ChevronRight size={14} />
                  </a>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="flex space-x-4 bg-white/10 backdrop-blur-sm border border-white/10 p-4"
                      data-testid={`selection-item-${item.id}`}
                    >
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-primary uppercase tracking-widest mb-1">{item.category}</p>
                        <h4 className="font-serif text-foreground text-base mb-1">{item.name}</h4>
                        <p className="text-foreground/50 text-xs font-light">{item.config}</p>
                      </div>
                      <button
                        onClick={() => setItems(items.filter(i => i.id !== item.id))}
                        className="text-foreground/30 hover:text-primary transition-colors flex-shrink-0 mt-1"
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-8 py-6 border-t border-white/20">
                <p className="text-xs text-foreground/50 font-light mb-4 leading-relaxed">
                  Seçimlerinizi showroom ziyaretinizde uzmanlarımızla birlikte değerlendirin.
                </p>
                <a
                  href="#iletisim"
                  onClick={onClose}
                  className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-4 text-sm uppercase tracking-wider font-medium hover:bg-primary/90 transition-colors"
                  data-testid="button-request-consultation"
                >
                  <span>Danışmanlık Talep Et</span>
                  <ChevronRight size={14} />
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <SelectionsPanel open={cartOpen} onClose={() => setCartOpen(false)} />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? "nav-gradient backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
          }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Left: Cart icon + nav links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-white/80 hover:text-primary transition-colors"
              data-testid="button-cart"
              aria-label="Seçtikleriniz"
            >
              <ShoppingBag size={22} />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-medium">
                2
              </span>
            </button>
            <div className="flex items-center space-x-8 text-sm uppercase tracking-widest text-white/80">
              {/* Ürünlerimiz dropdown */}
              <div className="relative group" data-testid="dropdown-urunlerimiz">
                <button className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors">
                  <span>Ürünlerimiz</span>
                  <ChevronDown size={12} className="transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div
                    className="backdrop-blur-md border border-white/10 py-2 min-w-[220px]"
                    style={{ background: "hsl(24 15% 10% / 0.96)" }}
                  >
                    <a href="/categories/salon" className="flex items-center justify-between px-6 py-3 text-xs text-white/70 hover:text-primary hover:bg-white/5 transition-colors tracking-widest uppercase group/item" data-testid="dropdown-koltuk">
                      <span>Salon Takımları</span>
                      <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </a>
                    <a href="/categories/bahce" className="flex items-center justify-between px-6 py-3 text-xs text-white/70 hover:text-primary hover:bg-white/5 transition-colors tracking-widest uppercase group/item" data-testid="dropdown-bahce">
                      <span>Bahçe Mobilyaları</span>
                      <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </a>
                    <a href="/categories/mutfak" className="flex items-center justify-between px-6 py-3 text-xs text-white/70 hover:text-primary hover:bg-white/5 transition-colors tracking-widest uppercase group/item" data-testid="dropdown-mutfak">
                      <span>Mutfak Dolapları</span>
                      <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </div>
              </div>
              <a href="#ozellestirme" className="text-white/80 hover:text-white transition-colors" data-testid="link-ozellestirme">Özelleştirme</a>
              <a href="#zanaat" className="text-white/80 hover:text-white transition-colors" data-testid="link-zanaat">Zanaat</a>
            </div>
          </div>

          <a href="#" data-testid="text-logo">
            <img
              src="/images/logo.png"
              alt="RN Consept"
              className="h-12 md:h-14 w-auto object-contain"
              style={{ mixBlendMode: "screen" }}
            />
          </a>

          <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest text-white/80">
            <a href="#one-cikanlar" className="text-white/80 hover:text-white transition-colors" data-testid="link-one-cikanlar">Öne Çıkanlar</a>
            <a href="#showroom" className="text-white/80 hover:text-white transition-colors" data-testid="link-showroom">Showroom</a>
            <a href="#iletisim" className="text-white/80 hover:text-white transition-colors" data-testid="link-iletisim">İletişim</a>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-white/80 hover:text-primary transition-colors"
              data-testid="button-cart-mobile"
            >
              <ShoppingBag size={22} />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-medium">
                2
              </span>
            </button>
            <button
              className="text-white"
              onClick={() => setMobileMenuOpen(true)}
              data-testid="button-mobile-menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav >

      {/* Mobile Menu */}
      <AnimatePresence>
        {
          mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed inset-0 z-[60] section-gradient flex flex-col items-center justify-center"
            >
              <button
                className="absolute top-6 right-6 text-foreground"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="button-close-menu"
              >
                <X size={32} />
              </button>
              <div className="flex flex-col space-y-8 text-2xl font-serif text-center">
                <a href="#koleksiyonlar" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Ürünlerimiz</a>
                <a href="#ozellestirme" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Özelleştirme</a>
                <a href="#zanaat" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Zanaat</a>
                <a href="#one-cikanlar" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Öne Çıkanlar</a>
                <a href="#showroom" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Showroom</a>
                <a href="#iletisim" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">İletişim</a>
              </div>
            </motion.div>
          )
        }
      </AnimatePresence >
    </>
  );
};

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

const Philosophy = () => {
  return (
    <section className="py-24 md:py-32 relative section-gradient" id="hakkimizda">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-8">
              Sıradanlığa Karşı Bir Duruş
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed font-light">
              RN Consept olarak, mobilyanın sadece bir eşya değil, yaşanmışlıkların sessiz bir tanığı olduğuna inanıyoruz. İstanbul'un kalbi Nişantaşı'nda doğan tasarım dilimiz, geleneksel Türk zanaatkarlığını modern, rafine ve heykelsi formlarla buluşturuyor. Her parça, evinize karakter katmak için özenle şekilleniyor.
            </p>
          </motion.div>
        </div>
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
                <h3 className="text-2xl font-serif mb-2 group-hover:text-primary transition-colors duration-300"><a href={`/categories/${cat.slug}`}>{cat.title}</a></h3>
                <p className="text-foreground/60 group-hover:text-primary/70 font-light transition-colors duration-300">{cat.desc}</p>
              </div>
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

  const pieces = dbProducts?.filter((p: any) => p.is_published).slice(0, 3).map((p: any) => ({
    id: p.id,
    name: p.title,
    category: dbCategories?.find((c: any) => c.id === p.category_id)?.name || "Kategori",
    material: p.description.substring(0, 40) + "...",
    img: p.images?.[0] || "/images/living-room.png"
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
          {pieces.map((piece, index) => (
            <motion.div
              key={piece.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
              data-testid={`card-featured-${piece.id}`}
            >
              <div className="relative aspect-square overflow-hidden mb-6 bg-card">
                <img
                  src={piece.img}
                  alt={piece.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <a href="#ozellestirme" className="text-white border-b border-white/50 pb-1 hover:border-white transition-colors text-sm uppercase tracking-widest">
                    Özelleştir
                  </a>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-serif mb-1">{piece.name}</h3>
                  <p className="text-sm text-foreground/50 uppercase tracking-widest">{piece.category}</p>
                </div>
              </div>
              <p className="text-sm font-light text-foreground/70 mt-3">{piece.material}</p>
            </motion.div>
          ))}
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

const Footer = () => {
  return (
    <footer className="section-gradient-alt pt-24 pb-12 border-t border-border/30" id="iletisim">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <img
              src="/images/logo.png"
              alt="RN Consept"
              className="h-16 w-auto object-contain mb-6"
              style={{ mixBlendMode: "screen" }}
            />
            <p className="text-foreground/60 font-light max-w-sm mb-8 leading-relaxed">
              Modern Türk tasarımının dünya standartlarında lüks ile buluştuğu nokta. Zamansız tasarımlar, eşsiz işçilik.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" data-testid="link-instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" data-testid="link-facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" data-testid="link-twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6">Keşfedin</h4>
            <ul className="space-y-4 font-light text-foreground/70">
              <li><a href="#koleksiyonlar" className="hover:text-primary transition-colors">Koleksiyonlar</a></li>
              <li><a href="#one-cikanlar" className="hover:text-primary transition-colors">İmza Parçalar</a></li>
              <li><a href="#ozellestirme" className="hover:text-primary transition-colors">Kişiselleştirme</a></li>
              <li><a href="#zanaat" className="hover:text-primary transition-colors">Ustalık ve Zanaat</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6">Bülten</h4>
            <p className="text-foreground/60 font-light mb-6">Yeni koleksiyonlardan ve özel davetlerden haberdar olun.</p>
            <form className="flex flex-col space-y-4" onSubmit={(e) => e.preventDefault()} data-testid="form-newsletter">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="bg-transparent border-b border-border py-3 px-0 w-full focus:outline-none focus:border-primary font-light transition-colors"
                data-testid="input-email"
              />
              <button
                type="submit"
                className="bg-foreground text-background py-3 font-medium tracking-wider uppercase text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="button-submit-newsletter"
              >
                Kayıt Ol
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/40 font-light">
          <p>&copy; {new Date().getFullYear()} RN Consept. Tüm hakları saklıdır.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-foreground transition-colors">Kullanım Şartları</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen font-sans overflow-x-hidden selection:bg-primary/30 selection:text-foreground">
      <Navbar />
      <Hero />
      <Philosophy />
      <FeaturedPieces />
      <Categories />
      <Craftsmanship />
      <Customization />
      <Showroom />
      <Footer />
    </main>
  );
}

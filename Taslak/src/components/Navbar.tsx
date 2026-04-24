import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, ShoppingBag, Menu, X } from "lucide-react";

// --- Navbar Types ---

type NavbarVariant = "home" | "category" | "product";

interface BreadcrumbItem {
    label: string;
    href: string | null;
}

interface NavbarProps {
    variant?: NavbarVariant;
    breadcrumbs?: BreadcrumbItem[];
}

// --- Navbar Component ---

const Navbar = ({ variant = "home", breadcrumbs = [] }: NavbarProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Show full navbar only on home page
    const showFullNavbar = variant === "home";

    // Render sticky breadcrumb bar for category/product pages
    if (!showFullNavbar) {
        return (
            <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border py-4">
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-2 md:gap-4">
                    {/* Logo - Link to home */}
                    <Link href="/" className="text-foreground hover:text-primary transition-colors flex-shrink-0">
                        <span className="text-sm md:text-lg font-serif tracking-widest uppercase">RN Consept</span>
                    </Link>

                    {/* Breadcrumbs - hidden on mobile */}
                    {breadcrumbs.length > 0 && (
                        <div className="hidden md:flex items-center gap-2 text-sm flex-1 justify-center overflow-hidden">
                            <Link href="/" className="text-foreground/50 hover:text-primary transition-colors whitespace-nowrap">
                                Ana Sayfa
                            </Link>
                            {breadcrumbs.map((crumb, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <ChevronRight size={14} className="text-foreground/30 flex-shrink-0" />
                                    {crumb.href ? (
                                        <Link href={crumb.href} className="text-foreground/50 hover:text-primary transition-colors whitespace-nowrap">
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="text-foreground font-medium whitespace-nowrap">{crumb.label}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Cart icon */}
                    <button onClick={() => setCartOpen(true)} className="relative text-foreground/70 hover:text-primary transition-colors flex-shrink-0" aria-label="Seçtikleriniz">
                        <ShoppingBag size={20} />
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-medium">0</span>
                    </button>
                </div>

                {/* Cart Panel */}
                <AnimatePresence>
                    {cartOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
                                onClick={() => setCartOpen(false)}
                            />
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
                                className="fixed top-0 left-0 h-full w-full max-w-md z-[80] flex flex-col"
                                style={{ background: "radial-gradient(ellipse at 38% 35%, hsl(43 22% 68%) 0%, hsl(43 16% 54%) 42%, hsl(43 12% 42%) 100%)" }}
                            >
                                <div className="flex items-center justify-between px-8 py-7 border-b border-white/20">
                                    <div className="flex items-center space-x-3">
                                        <ShoppingBag size={22} className="text-primary" />
                                        <h2 className="text-lg font-serif tracking-[0.2em] uppercase text-foreground">
                                            Seçtikleriniz
                                        </h2>
                                        <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">0</span>
                                    </div>
                                    <button onClick={() => setCartOpen(false)} className="text-foreground/60 hover:text-foreground transition-colors">
                                        <X size={22} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto px-8 py-6 flex items-center justify-center">
                                    <p className="text-foreground/60 font-light text-center">
                                        Henüz bir seçim yapmadınız.<br />
                                        Koleksiyonlarımızı keşfedip<br />beğendiklerinizi ekleyin.
                                    </p>
                                    <Link href="/categories/salon" onClick={() => setCartOpen(false)} className="mt-6 inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-primary/90 transition-colors">
                                        <span>Koleksiyonlara Git</span>
                                        <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>
        );
    }

    return (
        <>
            {/* Full Navbar - only on home page */}
            {showFullNavbar && (
                <>
                    {/* Cart Panel */}
                    <AnimatePresence>
                        {cartOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
                                    onClick={() => setCartOpen(false)}
                                />
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "-100%" }}
                                    transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
                                    className="fixed top-0 left-0 h-full w-full max-w-md z-[80] flex flex-col"
                                    style={{ background: "radial-gradient(ellipse at 38% 35%, hsl(43 22% 68%) 0%, hsl(43 16% 54%) 42%, hsl(43 12% 42%) 100%)" }}
                                >
                                    <div className="flex items-center justify-between px-8 py-7 border-b border-white/20">
                                        <div className="flex items-center space-x-3">
                                            <ShoppingBag size={22} className="text-primary" />
                                            <h2 className="text-lg font-serif tracking-[0.2em] uppercase text-foreground">
                                                Seçtikleriniz
                                            </h2>
                                            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">0</span>
                                        </div>
                                        <button onClick={() => setCartOpen(false)} className="text-foreground/60 hover:text-foreground transition-colors">
                                            <X size={22} />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto px-8 py-6 flex items-center justify-center">
                                        <p className="text-foreground/60 font-light text-center">
                                            Henüz bir seçim yapmadınız.<br />
                                            Koleksiyonlarımızı keşfedip<br />beğendiklerinizi ekleyin.
                                        </p>
                                        <Link href="/categories/salon" onClick={() => setCartOpen(false)} className="mt-6 inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-primary/90 transition-colors">
                                            <span>Koleksiyonlara Git</span>
                                            <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <nav className={`transition-all duration-500 ease-in-out ${isScrolled ? "bg-background/95 backdrop-blur-md py-3 shadow-sm" : "bg-transparent py-6"}`}>
                        <div className="container mx-auto px-6 flex justify-between items-center">
                            {/* Left: Cart + Nav links */}
                            <div className="hidden md:flex items-center space-x-8">
                                {/* Ürünlerimiz dropdown */}
                                <div className="relative group">
                                    <button className="flex items-center space-x-1 text-foreground/80 hover:text-foreground transition-colors text-sm uppercase tracking-widest">
                                        <span>Ürünlerimiz</span>
                                        <ChevronDown size={12} className="transition-transform duration-300 group-hover:rotate-180" />
                                    </button>
                                    <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="backdrop-blur-md border border-white/10 py-2 min-w-[220px]" style={{ background: "hsl(24 15% 10% / 0.96)" }}>
                                            <Link href="/categories/salon" className="flex items-center justify-between px-6 py-3 text-xs text-white/70 hover:text-primary hover:bg-white/5 transition-colors tracking-widest uppercase group/item">
                                                <span>Salon Takımları</span>
                                                <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                            </Link>
                                            <Link href="/categories/bahce" className="flex items-center justify-between px-6 py-3 text-xs text-white/70 hover:text-primary hover:bg-white/5 transition-colors tracking-widest uppercase group/item">
                                                <span>Bahçe Mobilyaları</span>
                                                <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                            </Link>
                                            <Link href="/categories/mutfak" className="flex items-center justify-between px-6 py-3 text-xs text-white/70 hover:text-primary hover:bg-white/5 transition-colors tracking-widest uppercase group/item">
                                                <span>Mutfak Dolapları</span>
                                                <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Ana sayfa linkleri */}
                                <Link href="#ozellestirme" className="text-white/80 hover:text-white transition-colors text-sm uppercase tracking-widest">Özelleştirme</Link>
                                <Link href="#zanaat" className="text-white/80 hover:text-white transition-colors text-sm uppercase tracking-widest">Zanaat</Link>
                            </div>

                            {/* Center: Logo */}
                            <Link href="/" className={isScrolled ? "text-foreground" : "text-white"}>
                                <span className="text-xl font-serif tracking-widest uppercase">RN Consept</span>
                            </Link>

                            {/* Right: Links */}
                            <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest text-foreground/80">
                                <Link href="#one-cikanlar" className="hover:text-foreground transition-colors">Öne Çıkanlar</Link>
                                <Link href="#showroom" className="hover:text-foreground transition-colors">Showroom</Link>
                                <Link href="#iletisim" className="hover:text-foreground transition-colors">İletişim</Link>
                            </div>

                            {/* Mobile: cart + hamburger */}
                            <div className="md:hidden flex items-center space-x-4">
                                <button onClick={() => setCartOpen(true)} className="relative text-white/80 hover:text-primary transition-colors" aria-label="Seçtikleriniz">
                                    <ShoppingBag size={22} />
                                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-medium">0</span>
                                </button>
                                <button className="text-white" onClick={() => setMobileMenuOpen(true)}>
                                    <Menu size={24} />
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: "100%" }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: "100%" }}
                                transition={{ type: "tween", duration: 0.4 }}
                                className="fixed inset-0 z-[60] section-gradient flex flex-col items-center justify-center"
                            >
                                <button className="absolute top-6 right-6 text-foreground" onClick={() => setMobileMenuOpen(false)}>
                                    <X size={32} />
                                </button>
                                <div className="flex flex-col space-y-8 text-2xl font-serif text-center">
                                    <Link href="/categories/salon" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Salon Takımları</Link>
                                    <Link href="/categories/bahce" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Bahçe Mobilyaları</Link>
                                    <Link href="/categories/mutfak" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Mutfak Dolapları</Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </>
    );
};

export default Navbar;
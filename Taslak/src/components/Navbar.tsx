import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, ShoppingBag, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

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
    const { user, logout } = useAuth();
    const { totalItems, cartItems, removeFromCart } = useCart();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Show full navbar only on home page
    const showFullNavbar = variant === "home";

    // Reusable mobile menu drawer
    const renderMobileMenu = () => (
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
                        
                        <div className="w-16 h-[1px] bg-foreground/20 mx-auto my-4"></div>
                        
                        {user ? (
                            <>
                                <p className="text-sm font-sans text-foreground/50 uppercase tracking-widest">Hesabım</p>
                                <Link href="/profile/orders" onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-primary transition-colors">Siparişlerim</Link>
                                <Link href="/profile/info" onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-primary transition-colors">Bilgilerim</Link>
                                <Link href="/profile/favorites" onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-primary transition-colors">Favorilerim</Link>
                                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-lg text-red-500 hover:text-red-400 transition-colors">Çıkış Yap</button>
                            </>
                        ) : (
                            <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors flex items-center justify-center gap-2">
                                <User size={24} />
                                <span>Giriş Yap</span>
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Render sticky breadcrumb bar for category/product pages
    if (!showFullNavbar) {
        return (
            <>
                <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border py-4">
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-2 md:gap-4">
                    {/* Logo - Link to home */}
                    <Link href="/" className="flex-shrink-0">
                        <img src="/images/rnyazi.svg" alt="RN Consept" className="h-6 md:h-8 w-auto object-contain" />
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

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0">
                        {/* User Menu */}
                        <div className="relative group hidden md:block">
                            {user ? (
                                <div className="flex items-center space-x-1 cursor-pointer text-foreground/70 hover:text-primary transition-colors">
                                    <User size={20} />
                                    <span className="text-sm uppercase tracking-widest hidden lg:inline-block">Hesabım</span>
                                    <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
                                </div>
                            ) : (
                                <Link href="/auth" className="flex items-center space-x-1 text-foreground/70 hover:text-primary transition-colors">
                                    <User size={20} />
                                    <span className="text-sm uppercase tracking-widest hidden lg:inline-block">Giriş Yap</span>
                                </Link>
                            )}
                            
                            {user && (
                                <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="backdrop-blur-md border border-border bg-background/95 py-2 min-w-[200px] shadow-lg">
                                        <div className="px-4 py-3 border-b border-border/50">
                                            <p className="text-xs text-foreground/60 uppercase tracking-wider">Hoş geldin,</p>
                                            <p className="text-sm font-medium text-foreground truncate">{user.displayName || user.email}</p>
                                        </div>
                                        <Link href="/profile/orders" className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-foreground/5 transition-colors">
                                            Siparişlerim
                                        </Link>
                                        <Link href="/profile/coupons" className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-foreground/5 transition-colors">
                                            Kuponlarım
                                        </Link>
                                        <Link href="/profile/info" className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-foreground/5 transition-colors">
                                            Bilgilerim
                                        </Link>
                                        <Link href="/profile/addresses" className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-foreground/5 transition-colors">
                                            Adreslerim
                                        </Link>
                                        <Link href="/profile/favorites" className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-foreground/5 transition-colors">
                                            Favorilerim
                                        </Link>
                                        <div className="border-t border-border/50 mt-1 pt-1">
                                            <button onClick={() => logout()} className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                                                <LogOut size={14} className="mr-2" />
                                                Çıkış Yap
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart Dropdown */}
                        <div className="relative group">
                            <Link href="/cart" className="relative flex text-foreground/70 hover:text-primary transition-colors flex-shrink-0" aria-label="Seçtikleriniz">
                                <ShoppingBag size={20} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-medium">{totalItems}</span>
                                )}
                            </Link>
                            
                            <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="bg-white border border-gray-200 py-0 shadow-2xl flex flex-col max-h-[480px] relative overflow-x-hidden" style={{ width: '420px' }}>
                                    {/* Top Arrow */}
                                    <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45 z-10"></div>
                                    
                                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-4">
                                        {cartItems.length === 0 ? (
                                            <p className="text-sm text-gray-500 text-center py-4">Sepetiniz şu an boş.</p>
                                        ) : (
                                            cartItems.map((item) => (
                                                <div key={item.id} className="flex gap-4">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-24 h-16 object-cover bg-gray-100" />
                                                    ) : (
                                                        <div className="w-24 h-16 bg-gray-100" />
                                                    )}
                                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                                        <p className="text-[13px] font-medium text-gray-700 uppercase leading-snug break-words pr-2">{item.name}</p>
                                                        <p className="text-xs text-gray-400 mt-1">x{item.quantity}</p>
                                                        <p className="text-[13px] font-bold text-gray-800 mt-1">{(item.price * item.quantity).toLocaleString('tr-TR')} TL</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {cartItems.length > 0 && (
                                        <div className="flex flex-col">
                                            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-100">
                                                <span className="text-sm text-gray-600">Toplam</span>
                                                <span className="text-sm font-bold text-gray-800">{cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString('tr-TR')} TL</span>
                                            </div>
                                            <Link href="/cart" className="block w-full text-center bg-[#3e4a52] text-white py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-[#2c353b] transition-colors">
                                                SEPETE GİT
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Mobile Menu Icon for !showFullNavbar */}
                        <button className="md:hidden text-foreground/70" onClick={() => setMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>
            {renderMobileMenu()}
            </>
        );
    }

    return (
        <>
            {/* Full Navbar - only on home page */}
            {showFullNavbar && (
                <>
                    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? "nav-gradient backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"}`}>
                        <div className="container mx-auto px-6 flex justify-between items-center">
                            {/* Left: Cart + Nav links */}
                            <div className="hidden md:flex items-center space-x-8">
                                {/* Ürünlerimiz dropdown */}
                                <div className="relative group">
                                    <button className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors text-sm uppercase tracking-widest font-medium">
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
                                <a href="#one-cikanlar" className="text-white/80 hover:text-white transition-colors text-sm uppercase tracking-widest">Öne Çıkanlar</a>
                                <a href="#zanaat" className="text-white/80 hover:text-white transition-colors text-sm uppercase tracking-widest">Zanaat</a>
                            </div>

                            {/* Center: Logo */}
                            <Link href="/">
                                <img
                                    src="/images/logo.png"
                                    alt="RN Consept"
                                    className="h-12 md:h-14 w-auto object-contain transition-opacity duration-300"
                                    style={isScrolled ? {} : { mixBlendMode: "screen" }}
                                />
                            </Link>

                            {/* Right: Links & User Menu */}
                            <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm uppercase tracking-widest text-white/80">
                                <a href="#ozellestirme" className="hover:text-white transition-colors">Özelleştirme</a>
                                <a href="#showroom" className="hover:text-white transition-colors">Showroom - İletişim</a>
                                
                                <div className="flex items-center space-x-6 pl-6 border-l border-white/20">
                                    {/* User Menu for Home Navbar */}
                                    <div className="relative group">
                                        {user ? (
                                            <div className="flex items-center space-x-1 cursor-pointer text-white/80 hover:text-white transition-colors">
                                                <User size={20} />
                                                <span className="hidden lg:inline-block">Hesabım</span>
                                                <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
                                            </div>
                                        ) : (
                                            <Link href="/auth" className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors">
                                                <User size={20} />
                                                <span className="hidden lg:inline-block">Giriş Yap</span>
                                            </Link>
                                        )}
                                        
                                        {user && (
                                            <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                <div className="backdrop-blur-md border border-white/10 py-2 min-w-[200px]" style={{ background: "hsl(24 15% 10% / 0.96)" }}>
                                                    <div className="px-6 py-3 border-b border-white/10">
                                                        <p className="text-xs text-white/50 uppercase tracking-wider">Hoş geldin,</p>
                                                        <p className="text-sm font-medium text-white truncate">{user.displayName || user.email}</p>
                                                    </div>
                                                    <Link href="/profile/orders" className="flex items-center px-6 py-2 text-xs text-white/70 hover:text-primary hover:bg-white/5 transition-colors tracking-widest uppercase">
                                                        Siparişlerim
                                                    </Link>
                                                    <Link href="/profile/coupons" className="flex items-center px-6 py-2 text-xs text-white/70 hover:text-primary hover:bg-white/5 transition-colors tracking-widest uppercase">
                                                        Kuponlarım
                                                    </Link>
                                                    <Link href="/profile/info" className="flex items-center px-6 py-2 text-xs text-white/70 hover:text-primary hover:bg-white/5 transition-colors tracking-widest uppercase">
                                                        Bilgilerim
                                                    </Link>
                                                    <Link href="/profile/addresses" className="flex items-center px-6 py-2 text-xs text-white/70 hover:text-primary hover:bg-white/5 transition-colors tracking-widest uppercase">
                                                        Adreslerim
                                                    </Link>
                                                    <Link href="/profile/favorites" className="flex items-center px-6 py-2 text-xs text-white/70 hover:text-primary hover:bg-white/5 transition-colors tracking-widest uppercase">
                                                        Favorilerim
                                                    </Link>
                                                    <div className="border-t border-white/10 mt-2 pt-2">
                                                        <button onClick={() => logout()} className="flex w-full items-center px-6 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors tracking-widest uppercase">
                                                            <LogOut size={12} className="mr-2" />
                                                            Çıkış Yap
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cart Dropdown */}
                                    <div className="relative group">
                                        <Link href="/cart" className="relative flex text-white/80 hover:text-white transition-colors flex-shrink-0" aria-label="Seçtikleriniz">
                                            <ShoppingBag size={20} />
                                            {totalItems > 0 && (
                                                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-medium">{totalItems}</span>
                                            )}
                                        </Link>
                                        
                                        <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                            <div className="bg-white border border-gray-200 py-0 shadow-2xl flex flex-col max-h-[480px] relative overflow-x-hidden" style={{ width: '420px' }}>
                                                {/* Top Arrow */}
                                                <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45 z-10"></div>
                                                
                                                <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-4">
                                                    {cartItems.length === 0 ? (
                                                        <p className="text-sm text-gray-500 text-center py-4">Sepetiniz şu an boş.</p>
                                                    ) : (
                                                        cartItems.map((item) => (
                                                            <div key={item.id} className="flex gap-4">
                                                                {item.image ? (
                                                                    <img src={item.image} alt={item.name} className="w-24 h-16 object-cover bg-gray-100" />
                                                                ) : (
                                                                    <div className="w-24 h-16 bg-gray-100" />
                                                                )}
                                                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                                                    <p className="text-[13px] font-medium text-gray-700 uppercase leading-snug break-words pr-2 truncate whitespace-normal line-clamp-2">{item.name}</p>
                                                                    <p className="text-xs text-gray-400 mt-1">x{item.quantity}</p>
                                                                    <p className="text-[13px] font-bold text-gray-800 mt-1">{(item.price * item.quantity).toLocaleString('tr-TR')} TL</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                                {cartItems.length > 0 && (
                                                    <div className="flex flex-col">
                                                        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-100">
                                                            <span className="text-sm text-gray-600">Toplam</span>
                                                            <span className="text-sm font-bold text-gray-800">{cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString('tr-TR')} TL</span>
                                                        </div>
                                                        <Link href="/cart" className="block w-full text-center bg-[#3e4a52] text-white py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-[#2c353b] transition-colors">
                                                            SEPETE GİT
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile: cart + hamburger */}
                            <div className="md:hidden flex items-center space-x-4">
                                <Link href="/cart" className="relative text-white/80 hover:text-primary transition-colors" aria-label="Seçtikleriniz">
                                    <ShoppingBag size={22} />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-medium">{totalItems}</span>
                                    )}
                                </Link>
                                <button className="text-white" onClick={() => setMobileMenuOpen(true)}>
                                    <Menu size={24} />
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* Mobile Menu */}
                    {renderMobileMenu()}
                </>
            )}
        </>
    );
};

export default Navbar;
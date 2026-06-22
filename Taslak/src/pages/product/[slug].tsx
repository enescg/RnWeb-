import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, ShoppingBag, Heart, Minus, Plus, ChevronDown, ChevronUp, Truck, CreditCard, Wrench } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchFabrics, fetchCategories } from "@/lib/api";
import Navbar from "@/components/Navbar";
import FabricSidePanel from "@/components/FabricSidePanel";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

// --- Alternative Products ---
const AlternativeProducts = ({ currentProductId, categoryId }: { currentProductId: string, categoryId: string }) => {
    const { data: dbProducts } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
    const { data: dbCategories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

    const pieces = dbProducts?.filter((p: any) => p.is_published && p.id !== currentProductId && p.category_id === categoryId).slice(0, 3).map((p: any) => ({
        id: p.id,
        slug: p.slug,
        name: p.title,
        category: dbCategories?.find((c: any) => c.id === p.category_id)?.name || "Kategori",
        price: (p.base_price_without_fabric * 1.1).toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + " TL",
        discountedPrice: p.base_price_without_fabric.toLocaleString('tr-TR') + " TL",
        img: p.images?.[0] || "/images/living-room.png",
        isFreeShipping: p.is_free_shipping !== false
    })) || [];

    if (pieces.length === 0) return null;

    return (
        <section className="py-24 bg-secondary/30 border-t border-border/30 mt-16" id="alternatifler">
            <div className="container mx-auto px-6">
                <div className="mb-12 text-center">
                    <span className="text-primary uppercase tracking-widest text-xs font-semibold block mb-3">Benzer Ürünler</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-foreground">Alternatif Ürünler</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 luxury-grid">
                    {pieces.map((piece: any, index: number) => (
                        <motion.div
                            key={piece.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            className="group"
                        >
                            <Link href={`/product/${piece.id}`}>
                                <a className="block relative aspect-square overflow-hidden mb-6 bg-card">
                                    <img
                                        src={piece.img}
                                        alt={piece.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                        <span className="text-white border-b border-white/50 pb-1 group-hover:border-white transition-colors text-sm uppercase tracking-widest">
                                            İncele
                                        </span>
                                    </div>
                                </a>
                            </Link>
                            <div className="px-1 mt-3">
                                <Link href={`/product/${piece.id}`}>
                                    <a className="text-lg md:text-xl font-sans font-semibold tracking-wide text-black mb-1.5 group-hover:text-primary transition-colors block">{piece.name}</a>
                                </Link>
                                <div className="flex flex-col mb-3">
                                    <span className="text-foreground/50 text-xs md:text-sm line-through">
                                        {piece.price}
                                    </span>
                                    <span className="text-rose-700 font-bold text-base md:text-lg">
                                        Sepette: {piece.discountedPrice}
                                    </span>
                                </div>
                                {piece.isFreeShipping && (
                                    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-[10px] md:text-xs px-2.5 py-0.5 rounded-sm w-fit font-medium">
                                        <Truck size={12} className="md:size-3.5" />
                                        <span>Ücretsiz Teslimat</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Image Gallery ---
const ImageGallery = ({ images }: { images: string[] }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Reset active index if list of images changes (e.g. fabric change prepends a new image)
    useEffect(() => {
        setActiveIndex(0);
    }, [images]);

    if (!images || images.length === 0) {
        return <div className="w-full h-full bg-gray-100 flex items-center justify-center">Görsel Yok</div>;
    }

    return (
        <div className="relative w-full h-full flex flex-col justify-between">
            {/* Main Image Container */}
            <div className="relative flex-1 w-full min-h-0 overflow-hidden bg-card">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeIndex}
                        src={images[activeIndex]}
                        alt="Ürün"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full object-cover lg:object-cover"
                    />
                </AnimatePresence>
                
                {/* Mobile Pagination Dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 lg:hidden z-10">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${
                                    activeIndex === idx ? "bg-primary w-5" : "bg-black/35"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
            
            {/* Desktop Thumbnails */}
            {images.length > 1 && (
                <div className="hidden lg:flex gap-3 mt-4 overflow-x-auto py-1">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-all rounded-md ${
                                activeIndex === index ? 'border-primary scale-95 shadow-sm' : 'border-gray-200 hover:border-gray-400'
                            }`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Quantity Selector ---
const QuantitySelector = ({ quantity, onChange }: { quantity: number; onChange: (q: number) => void }) => (
    <div className="flex items-center border border-border w-fit">
        <button onClick={() => onChange(Math.max(1, quantity - 1))} className="p-3 hover:bg-primary/10 transition-colors"><Minus size={16} /></button>
        <span className="px-6 text-sm font-medium">{quantity}</span>
        <button onClick={() => onChange(quantity + 1)} className="p-3 hover:bg-primary/10 transition-colors"><Plus size={16} /></button>
    </div>
);

// --- Page ---
export default function ProductPage() {
    const { slug } = useParams();
    const { data: products, isLoading: pLoading } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
    const { data: fabrics, isLoading: fLoading } = useQuery({ queryKey: ["fabrics"], queryFn: fetchFabrics });
    const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
    const { addToCart, isLoading: cartLoading } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    const [selectedFabricId, setSelectedFabricId] = useState("");
    const [isFabricPanelOpen, setIsFabricPanelOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [setQuantities, setSetQuantities] = useState<Record<string, number>>({});
    const [selectedFabrics, setSelectedFabrics] = useState<Record<string, string>>({});
    const [selectedLegs, setSelectedLegs] = useState<Record<string, string>>({});
    const [activeFabricItemId, setActiveFabricItemId] = useState<string | null>(null);
    const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>("ozellikler");

    const product = products?.find((p: any) => p.id === slug); // API şimdilik ID bazlı çalışıyor

    useEffect(() => {
        if (product && product.set_items && product.set_items.length > 0) {
            const initial: Record<string, number> = {};
            product.set_items.forEach((item: any) => {
                initial[item.id] = item.default_quantity !== undefined ? item.default_quantity : 1;
            });
            setSetQuantities(initial);
        }
    }, [product]);

    useEffect(() => {
        if (product && !selectedFabricId) {
            setSelectedFabricId(product.default_fabric_id);
        }
    }, [product, selectedFabricId]);

    if (pLoading || fLoading) {
        return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-serif mb-4">Ürün Bulunamadı</h1>
                    <Link href="/" className="text-primary hover:underline">Anasayfaya Dön</Link>
                </div>
            </div>
        );
    }

    const category = categories?.find((c: any) => c.id === product.category_id);
    const breadcrumbs = [
        { label: category?.name || "Kategori", href: `/categories/${category?.slug}` },
        { label: product.title, href: null }
    ];

    // FİYAT HESAPLAMA MANTIĞI
    const isTeam = product.set_items && product.set_items.length > 0;
    
    let basePrice = product.base_price_without_fabric || 0;
    let finalPrice = 0;
    const selectedFabric = fabrics?.find((f: any) => f.id === selectedFabricId);

    const groupedFabrics = useMemo(() => {
        const activeFabrics = fabrics?.filter((f) => f.is_active !== false) || [];
        const groups: Record<string, Fabric[]> = {};
        const standalone: Fabric[] = [];

        activeFabrics.forEach((fabric) => {
            const gName = fabric.group_name?.trim();
            if (gName) {
                if (!groups[gName]) {
                    groups[gName] = [];
                }
                groups[gName].push(fabric);
            } else {
                standalone.push(fabric);
            }
        });

        return { groups, standalone };
    }, [fabrics]);

    const galleryImages = [
        ...(selectedFabric?.image_url ? [selectedFabric.image_url] : []),
        ...(product.images || [])
    ];

    if (isTeam) {
        finalPrice = product.set_items.reduce((total: number, item: any) => {
            const qty = setQuantities[item.id] || 0;
            const itemFabricId = selectedFabrics[item.id];
            const itemFabric = itemFabricId ? fabrics?.find((f: any) => f.id === itemFabricId) : null;
            const fabricPrice = itemFabric ? (itemFabric.price_per_sqm * item.fabric_sqm) : 0;
            return total + ((item.base_price + fabricPrice) * qty);
        }, 0);
    } else {
        const sqm = product.fabric_sqm_required || 0;
        finalPrice = basePrice + (sqm * (selectedFabric?.price_per_sqm || 0));
    }

    const handleAddToCart = () => {
        addToCart({
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.title,
            price: finalPrice,
            quantity: quantity,
            image: product.images?.[0],
            fabricName: selectedFabric?.name,
            isTeam,
            isFreeShipping: product.is_free_shipping !== false,
            isFreeInstallation: product.is_free_installation !== false,
            deliveryTimeWeeks: product.delivery_time_weeks || 4,
            setItems: isTeam ? product.set_items.map((item: any) => ({
                ...item,
                quantity: setQuantities[item.id] || 0,
                selectedFabric: selectedFabrics[item.id] ? fabrics?.find((f: any) => f.id === selectedFabrics[item.id])?.name : "Standart",
                selectedLeg: selectedLegs[item.id] || "Standart"
            })) : undefined
        });
    };

    const getCustomizationSummary = () => {
        if (isTeam) {
            const activeItems = product.set_items.filter((item: any) => (setQuantities[item.id] || 0) > 0);
            if (activeItems.length === 0) return "Hiçbir parça seçilmedi";
            return activeItems.map((item: any) => {
                const qty = setQuantities[item.id];
                const itemFabricId = selectedFabrics[item.id];
                const itemFabric = itemFabricId ? fabrics?.find((f: any) => f.id === itemFabricId) : null;
                const fabricName = itemFabric ? itemFabric.name : "Standart";
                const legText = selectedLegs[item.id] ? `, Ayak: ${selectedLegs[item.id]}` : "";
                return `${qty > 1 ? `${qty}x ` : ""}${item.name} (${fabricName}${legText})`;
            }).join(" + ");
        } else {
            return `Kumaş: ${selectedFabric?.name || "Standart Kumaş"}`;
        }
    };

    return (
        <main className="min-h-screen font-sans pb-24 md:pb-28">
            <Navbar variant="product" breadcrumbs={breadcrumbs} />

            <div className="lg:container lg:mx-auto lg:px-6 lg:py-20">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0 lg:gap-16 items-start h-[calc(100vh-4rem)] lg:h-auto overflow-hidden lg:overflow-visible">
                    
                    {/* Image Column */}
                    <div className="w-full h-[38vh] min-h-[250px] lg:h-auto shrink-0 lg:sticky lg:top-24 bg-card border-b lg:border-b-0 border-gray-100 p-2 lg:p-0">
                        <ImageGallery images={galleryImages} />
                    </div>

                    {/* Options Column */}
                    <div className="flex-1 overflow-y-auto lg:overflow-visible p-6 lg:p-0 space-y-8 pb-32 lg:pb-0">
                        <div>
                            <span className="inline-block px-3 py-1 text-xs uppercase tracking-widest bg-primary text-white mb-4">
                                {category?.name}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-3">{product.title}</h1>
                            {!isTeam && product.description && (
                                <p className="text-lg text-foreground/60 font-light">{product.description}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-serif text-foreground font-bold">
                                    {finalPrice.toLocaleString('tr-TR')} TL
                                </span>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-primary text-primary" />)}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.is_free_shipping !== false && (
                                    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md w-fit font-medium">
                                        <Truck size={14} />
                                        <span>Ücretsiz Teslimat</span>
                                    </div>
                                )}
                                {product.is_free_installation !== false && (
                                    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md w-fit font-medium">
                                        <Wrench size={14} />
                                        <span>Ücretsiz Kurulum</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Kumaş Seçenekleri (Sadece Tekil Ürün ise) */}
                        {!isTeam && (
                            <div className="border-t border-border pt-6 space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-2">KUMAŞ SEÇİMİ</h4>
                                
                                <div className="space-y-6">
                                    {/* Gruplanmış Kumaşlar */}
                                    {Object.entries(groupedFabrics.groups).map(([groupName, variants]) => {
                                        const isAnySelected = variants.some((v) => v.id === selectedFabricId);
                                        const selectedVariant = variants.find((v) => v.id === selectedFabricId);
                                        
                                        return (
                                            <div key={groupName} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-800">{groupName}</span>
                                                    {isAnySelected && selectedVariant && (
                                                        <span className="text-xs text-primary font-semibold">
                                                            {selectedVariant.name} (+{(selectedVariant.price_per_sqm * (product.fabric_sqm_required || 0)).toLocaleString('tr-TR')} $)
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {variants.map((variant) => {
                                                        const isSelected = selectedFabricId === variant.id;
                                                        return (
                                                            <button
                                                                key={variant.id}
                                                                type="button"
                                                                onClick={() => setSelectedFabricId(variant.id)}
                                                                className={`relative w-9 h-9 rounded-full overflow-hidden border transition-all ${
                                                                    isSelected
                                                                        ? "ring-2 ring-primary border-transparent ring-offset-1 scale-105"
                                                                        : "border-gray-200 hover:border-gray-400"
                                                                }`}
                                                                title={variant.name}
                                                            >
                                                                {variant.image_url ? (
                                                                    <img src={variant.image_url} alt={variant.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">?</div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Bağımsız Kumaşlar */}
                                    {groupedFabrics.standalone.length > 0 && (
                                        <div className="space-y-2">
                                            <span className="text-sm font-medium text-gray-800">Diğer Kumaşlar</span>
                                            <div className="flex flex-wrap gap-2">
                                                {groupedFabrics.standalone.map((fabric) => {
                                                    const isSelected = selectedFabricId === fabric.id;
                                                    return (
                                                        <button
                                                            key={fabric.id}
                                                            type="button"
                                                            onClick={() => setSelectedFabricId(fabric.id)}
                                                            className={`relative w-9 h-9 rounded-full overflow-hidden border transition-all ${
                                                                isSelected
                                                                    ? "ring-2 ring-primary border-transparent ring-offset-1 scale-105"
                                                                    : "border-gray-200 hover:border-gray-400"
                                                            }`}
                                                            title={fabric.name}
                                                        >
                                                            {fabric.image_url ? (
                                                                <img src={fabric.image_url} alt={fabric.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">?</div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Özelleştir (Sadece isTeam ise) */}
                        {isTeam && (
                            <div id="team-menu-section" className="border-t border-border pt-6">
                                <h4 className="text-base font-bold uppercase tracking-widest text-foreground/80 mb-4">Özelleştir</h4>
                                <div className="space-y-4">
                                    {product.set_items.map((item: any) => {
                                        const availableLegs = item.leg_color ? item.leg_color.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
                                        const selectedItemFabricId = selectedFabrics[item.id] || product.default_fabric_id;
                                        const selectedItemFabric = fabrics?.find((f: any) => f.id === selectedItemFabricId);
                                        return (
                                            <div key={item.id} className="flex flex-row gap-4 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
                                                {/* Left: Image */}
                                                <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center relative mt-1">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-[10px] text-gray-400">Görsel Yok</span>
                                                    )}
                                                </div>

                                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                                    <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3 mb-2">
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-800 text-base truncate">{item.name}</p>
                                                            <p className="text-xs text-primary font-medium">+{item.base_price.toLocaleString('tr-TR')} TL</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <button 
                                                                onClick={() => setSetQuantities({...setQuantities, [item.id]: Math.max(0, (setQuantities[item.id] || 0) - 1)})}
                                                                className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors text-sm"
                                                            >-</button>
                                                            <span className="w-4 text-center font-bold text-sm">{setQuantities[item.id] || 0}</span>
                                                            <button 
                                                                onClick={() => setSetQuantities({...setQuantities, [item.id]: (setQuantities[item.id] || 0) + 1})}
                                                                className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors text-sm"
                                                            >+</button>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-200 mt-2 space-y-3">
                                                        {/* Fabric Selection */}
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium text-gray-700">Kumaş:</span>
                                                                <span className="font-semibold text-primary">
                                                                    {selectedItemFabric?.name || "Standart Kumaş"}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {fabrics?.filter(f => f.is_active !== false).map((fabric) => {
                                                                    const isSelected = selectedItemFabricId === fabric.id;
                                                                    return (
                                                                        <button
                                                                            key={fabric.id}
                                                                            type="button"
                                                                            onClick={() => setSelectedFabrics(prev => ({ ...prev, [item.id]: fabric.id }))}
                                                                            className={`relative w-6 h-6 rounded-full overflow-hidden border transition-all ${
                                                                                isSelected
                                                                                    ? "ring-2 ring-primary border-transparent ring-offset-1 scale-105"
                                                                                    : "border-gray-200 hover:border-gray-400"
                                                                            }`}
                                                                            title={fabric.name}
                                                                        >
                                                                            {fabric.image_url ? (
                                                                                <img src={fabric.image_url} alt={fabric.name} className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[6px] text-gray-500">?</div>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* Leg Selection */}
                                                        <div className="flex items-center gap-2 pt-1 border-t border-gray-100/50">
                                                            <span className="font-medium text-gray-700">Seçili Ayak:</span>
                                                            {availableLegs.length > 0 ? (
                                                                <div className="flex gap-1.5 flex-wrap">
                                                                    {availableLegs.map((leg: string) => (
                                                                        <button
                                                                            key={leg}
                                                                            onClick={() => setSelectedLegs(prev => ({...prev, [item.id]: leg}))}
                                                                            className={`px-2 py-0.5 text-[10px] rounded transition-all font-medium ${selectedLegs[item.id] === leg ? 'bg-gray-800 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-500'}`}
                                                                        >
                                                                            {leg}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400">Standart Ayaklar</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-border pt-6 space-y-4">
                            <QuantitySelector quantity={quantity} onChange={setQuantity} />
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={cartLoading}
                                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-4 text-sm uppercase tracking-wider font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    <ShoppingBag size={18} />
                                    <span>{(finalPrice * quantity).toLocaleString('tr-TR')} TL - Sepete Ekle</span>
                                </button>
                                <button 
                                    onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                                    className="w-14 h-14 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                                >
                                    <Heart size={20} className={isFavorite(product.id) ? "fill-primary text-primary" : ""} />
                                </button>
                            </div>
                            <p className="text-xs text-foreground/40 font-light text-center">Detaylı bilgi ve fiyat teklifi için showroom ziyaretinizde uzmanlarımızla görüşebilirsiniz.</p>
                            
                            <div className="flex flex-col gap-3 mt-4">
                                {product.delivery_info && (
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 border border-gray-100 p-4 rounded-lg">
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <Truck size={20} className="text-primary shrink-0" />
                                            <span className="font-medium">{product.delivery_info}</span>
                                        </div>
                                        {product.delivery_time_weeks && (
                                            <div className="flex items-center gap-2 text-sm text-gray-700 pt-3 sm:pt-0 sm:border-l sm:border-gray-200 sm:pl-4 mt-3 sm:mt-0 border-t border-gray-200 sm:border-t-0 shrink-0">
                                                <span className="font-semibold text-primary">{product.delivery_time_weeks} Hafta</span>
                                                <span className="text-xs">Teslimat Süresi</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {product.installment_info && (
                                    <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 border border-gray-100 p-4 rounded-lg">
                                        <CreditCard size={20} className="text-primary" />
                                        <span className="font-medium">{product.installment_info}</span>
                                    </div>
                                )}
                            </div>

                            {/* Accordion Sections */}
                            <div className="mt-8 border-t border-border pt-4">
                                {/* 1. Ürün Özellikleri */}
                                <div className="border-b border-gray-200">
                                    <button 
                                        onClick={() => setOpenAccordion(openAccordion === 'ozellikler' ? null : 'ozellikler')}
                                        className="w-full flex items-center justify-between py-4 text-left font-serif text-lg text-gray-800 hover:text-primary transition-colors"
                                    >
                                        <span>Ürün Özellikleri</span>
                                        {openAccordion === 'ozellikler' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    {openAccordion === 'ozellikler' && (
                                        <div className="pb-6 text-sm text-gray-600 space-y-3">
                                            {isTeam && (
                                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                                    <span className="font-semibold text-gray-800">Takım İçeriği</span>
                                                    <span className="text-right">{product.set_items.map((i: any) => i.name).join(' + ')}</span>
                                                </div>
                                            )}
                                            {product.features?.fabric_info && <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-semibold text-gray-800">Kumaş Bilgileri</span><span className="text-right">{product.features.fabric_info}</span></div>}
                                            {product.features?.function && <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-semibold text-gray-800">Fonksiyon</span><span className="text-right">{product.features.function}</span></div>}
                                            {product.features?.skeleton && <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-semibold text-gray-800">İskelet Malzemesi</span><span className="text-right">{product.features.skeleton}</span></div>}
                                            {product.features?.seating_inner && <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-semibold text-gray-800">Oturum İç Malzemesi</span><span className="text-right">{product.features.seating_inner}</span></div>}
                                            {product.features?.seating_softness && <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-semibold text-gray-800">Oturum Yumuşaklığı</span><span className="text-right">{product.features.seating_softness}</span></div>}
                                            {product.features?.leg_material && <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-semibold text-gray-800">Ayak Malzemesi</span><span className="text-right">{product.features.leg_material}</span></div>}
                                            {product.features?.leg_color && <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-semibold text-gray-800">Ayak Rengi</span><span className="text-right">{product.features.leg_color}</span></div>}
                                            {product.features?.assembly_parts && <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-semibold text-gray-800">Demonte Parçalar</span><span className="text-right">{product.features.assembly_parts}</span></div>}
                                            {product.features?.fabric_material && <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-semibold text-gray-800">Kumaş Malzemesi</span><span className="text-right">{product.features.fabric_material}</span></div>}
                                            {product.features?.extra_info && <div className="flex flex-col pt-2"><span className="font-semibold text-gray-800 mb-1">Ek Bilgiler</span><span className="leading-relaxed">{product.features.extra_info}</span></div>}
                                        </div>
                                    )}
                                </div>

                                {/* 2. Ürün Boyutları */}
                                <div className="border-b border-gray-200">
                                    <button 
                                        onClick={() => setOpenAccordion(openAccordion === 'boyutlar' ? null : 'boyutlar')}
                                        className="w-full flex items-center justify-between py-4 text-left font-serif text-lg text-gray-800 hover:text-primary transition-colors"
                                    >
                                        <span>Ürün Boyutları</span>
                                        {openAccordion === 'boyutlar' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    {openAccordion === 'boyutlar' && (
                                        <div className="pb-6 overflow-x-auto">
                                            <table className="w-full text-sm text-left text-gray-600 border border-gray-100 rounded-lg overflow-hidden">
                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-4 py-3">Parça</th>
                                                        <th className="px-4 py-3 border-l border-gray-100">Genişlik</th>
                                                        <th className="px-4 py-3 border-l border-gray-100">Derinlik</th>
                                                        <th className="px-4 py-3 border-l border-gray-100">Yükseklik</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isTeam ? product.set_items.map((item: any, i: number) => (
                                                        <tr key={item.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} border-b border-gray-100 last:border-b-0`}>
                                                            <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-100">{item.name}</td>
                                                            <td className="px-4 py-3 border-r border-gray-100">{item.dimensions?.width || '-'}</td>
                                                            <td className="px-4 py-3 border-r border-gray-100">{item.dimensions?.depth || '-'}</td>
                                                            <td className="px-4 py-3">{item.dimensions?.height || '-'}</td>
                                                        </tr>
                                                    )) : (
                                                        <tr className="bg-white">
                                                            <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-100">{product.title}</td>
                                                            <td className="px-4 py-3 border-r border-gray-100">-</td>
                                                            <td className="px-4 py-3 border-r border-gray-100">-</td>
                                                            <td className="px-4 py-3">-</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* 3. Ödeme ve Taksit */}
                                <div className="border-b border-gray-200">
                                    <button 
                                        onClick={() => setOpenAccordion(openAccordion === 'odeme' ? null : 'odeme')}
                                        className="w-full flex items-center justify-between py-4 text-left font-serif text-lg text-gray-800 hover:text-primary transition-colors"
                                    >
                                        <span>Ödeme ve Taksit</span>
                                        {openAccordion === 'odeme' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    {openAccordion === 'odeme' && (
                                        <div className="pb-6 text-sm text-gray-600">
                                            <div className="p-8 border border-dashed border-gray-300 rounded-lg text-center bg-gray-50 text-gray-500">
                                                <CreditCard className="mx-auto mb-2 opacity-50" size={32} />
                                                <p>Banka taksit seçenekleri sistemi çok yakında buraya eklenecektir.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 4. Teslimat ve Kurulum */}
                                <div className="border-b border-gray-200">
                                    <button 
                                        onClick={() => setOpenAccordion(openAccordion === 'teslimat' ? null : 'teslimat')}
                                        className="w-full flex items-center justify-between py-4 text-left font-serif text-lg text-gray-800 hover:text-primary transition-colors"
                                    >
                                        <span>Teslimat ve Kurulum</span>
                                        {openAccordion === 'teslimat' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    {openAccordion === 'teslimat' && (
                                        <div className="pb-6 text-sm text-gray-600 space-y-4 leading-relaxed">
                                            <p><strong className="text-gray-800 block mb-1">Ücretsiz Teslimat ve Montaj:</strong> RNCONSEPT’ten aldığınız her ürün, yaşam alanınıza değer katmak için yola çıkar. Nakliye ve profesyonel montaj hizmetimizden tamamen ücretsiz olarak faydalanabilirsiniz.</p>
                                            
                                            <p><strong className="text-gray-800 block mb-1">Planlı Teslimat:</strong> Ürününüz hazır olduğunda, ekibimiz teslimattan 24 saat önce sizinle iletişime geçer ve takviminize en uygun saati belirler.</p>
                                            
                                            <p><strong className="text-gray-800 block mb-1">Uzman Kadro:</strong> Montaj işlemleriniz, yalnızca mobilya kurulumu üzerine uzmanlaşmış, deneyimli teknik ekiplerimiz tarafından titizlikle gerçekleştirilir.</p>
                                            
                                            <p><strong className="text-gray-800 block mb-1">Bölgesel Bilgilendirme:</strong> Satış noktalarımıza uzak olan ilçe, köy veya kırsal bölgeler için mesafe ve ürün hacmine bağlı olarak ek nakliye maliyetleri oluşabilir. Bölgenizdeki güncel teslimat şartlarını öğrenmek için müşteri destek hattımızla dilediğiniz zaman görüşebilirsiniz.</p>
                                            
                                            <p><strong className="text-gray-800 block mb-1">Esneklik ve Destek:</strong> Hava şartları veya trafik yoğunluğu gibi kontrol dışı durumlarda oluşabilecek ufak gecikmelerde sizi anlık olarak bilgilendiriyoruz. Anlayışınız için teşekkür eder, mobilyalarınızı en keyifli anlarınızda kullanmanızı dileriz.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FabricSidePanel 
                isOpen={isFabricPanelOpen}
                onClose={() => setIsFabricPanelOpen(false)}
                fabrics={fabrics || []}
                selectedFabricId={activeFabricItemId ? selectedFabrics[activeFabricItemId] : selectedFabricId}
                onSelect={(id) => {
                    if (activeFabricItemId) {
                        setSelectedFabrics(prev => ({ ...prev, [activeFabricItemId]: id }));
                    } else {
                        setSelectedFabricId(id);
                    }
                }}
            />
            {product && <AlternativeProducts currentProductId={product.id} categoryId={product.category_id} />}
            
            {/* Sticky Bottom Add to Cart Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] py-3.5 md:py-4 transition-all duration-300">
                <div className="container mx-auto px-6 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-xl md:text-2xl font-serif text-foreground font-bold leading-none">
                                {(finalPrice * quantity).toLocaleString('tr-TR')} TL
                            </span>
                            {quantity > 1 && (
                                <span className="text-xs text-gray-400">({quantity} adet)</span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500 font-light truncate block mt-1" title={getCustomizationSummary()}>
                            {getCustomizationSummary()}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden md:block scale-90 origin-right">
                            <QuantitySelector quantity={quantity} onChange={setQuantity} />
                        </div>
                        
                        <button
                            onClick={handleAddToCart}
                            disabled={cartLoading}
                            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 md:px-8 md:py-4 text-xs md:text-sm uppercase tracking-wider font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
                        >
                            <ShoppingBag size={16} />
                            <span>Sepete Ekle</span>
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
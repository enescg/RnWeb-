import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, ShoppingBag, Heart, Minus, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchFabrics, fetchCategories } from "@/lib/api";
import Navbar from "@/components/Navbar";
import FabricSidePanel from "@/components/FabricSidePanel";

// --- Image Gallery ---
const ImageGallery = ({ images }: { images: string[] }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) {
        return <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center">Görsel Yok</div>;
    }

    return (
        <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden bg-card">
                <AnimatePresence mode="wait">
                    <motion.img key={activeIndex} src={images[activeIndex]} alt="Ürün" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full h-full object-cover" />
                </AnimatePresence>
            </div>
            {images.length > 1 && (
                <div className="flex gap-3">
                    {images.map((img, index) => (
                        <button key={index} onClick={() => setActiveIndex(index)} className={`w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${activeIndex === index ? 'border-primary' : 'border-transparent'}`}>
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

    const [selectedFabricId, setSelectedFabricId] = useState("");
    const [isFabricPanelOpen, setIsFabricPanelOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const product = products?.find((p: any) => p.id === slug); // API şimdilik ID bazlı çalışıyor

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
    const basePrice = product.base_price_without_fabric || 0;
    const sqm = product.fabric_sqm_required || 0;
    const selectedFabric = fabrics?.find((f: any) => f.id === selectedFabricId);
    
    // Toplam Fiyat = Çıplak Fiyat + (Seçili Kumaş M2 Fiyatı * Kumaş İhtiyacı)
    const finalPrice = basePrice + (sqm * (selectedFabric?.price_per_sqm || 0));

    return (
        <main className="min-h-screen font-sans">
            <Navbar variant="product" breadcrumbs={breadcrumbs} />

            <div className="container mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    <ImageGallery images={product.images || []} />

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
                        <div>
                            <span className="inline-block px-3 py-1 text-xs uppercase tracking-widest bg-primary text-white mb-4">
                                {category?.name}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-3">{product.title}</h1>
                            <p className="text-lg text-foreground/60 font-light">{product.description}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-serif text-foreground font-bold">
                                {finalPrice.toLocaleString('tr-TR')} ₺
                            </span>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-primary text-primary" />)}
                            </div>
                        </div>

                        {/* Dinamik Kumaş Seçici */}
                        <div className="border-t border-border pt-6">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h4 className="text-sm uppercase tracking-widest text-foreground/60 mb-1">Seçili Kumaş</h4>
                                    <p className="font-medium text-lg">{selectedFabric?.name || "Kumaş Seçilmedi"}</p>
                                </div>
                                <button 
                                    onClick={() => setIsFabricPanelOpen(true)}
                                    className="text-sm text-primary underline hover:text-primary/80 transition-colors"
                                >
                                    Kumaşı Değiştir
                                </button>
                            </div>
                            
                            {selectedFabric && (
                                <div className="flex items-center gap-4 p-4 bg-gray-50 border rounded-lg">
                                    {selectedFabric.image_url && (
                                        <img src={selectedFabric.image_url} alt="" className="w-16 h-16 rounded object-cover" />
                                    )}
                                    <div className="text-sm text-gray-600">
                                        <p>Fiyat Farkı: <span className="font-medium">{(selectedFabric.price_per_sqm * sqm).toLocaleString('tr-TR')} ₺</span></p>
                                        <p className="text-xs mt-1">({selectedFabric.price_per_sqm} ₺/m² x {sqm}m² ürün ihtiyacı)</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-border pt-6 space-y-4">
                            <QuantitySelector quantity={quantity} onChange={setQuantity} />
                            <div className="flex gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-4 text-sm uppercase tracking-wider font-medium hover:bg-primary/90 transition-colors">
                                    <ShoppingBag size={18} />
                                    <span>{(finalPrice * quantity).toLocaleString('tr-TR')} ₺ - Sepete Ekle</span>
                                </button>
                                <button className="w-14 h-14 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"><Heart size={20} /></button>
                            </div>
                            <p className="text-xs text-foreground/40 font-light text-center">Detaylı bilgi ve fiyat teklifi için showroom ziyaretinizde uzmanlarımızla görüşebilirsiniz.</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Kumaş Drawer Paneli */}
            <FabricSidePanel 
                isOpen={isFabricPanelOpen}
                onClose={() => setIsFabricPanelOpen(false)}
                fabrics={fabrics || []}
                selectedFabricId={selectedFabricId}
                onSelect={(id) => setSelectedFabricId(id)}
            />
        </main>
    );
}
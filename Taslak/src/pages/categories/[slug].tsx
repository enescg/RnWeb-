import { useParams, Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { Grid3x3, List, Heart, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";

// --- Product Card ---

const ProductCard = ({ product, index }: { product: any; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-[4/5] overflow-hidden mb-5 bg-card">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-1000 ${isHovered ? 'scale-105' : 'scale-100'}`}
                />
                {product.tag && (
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 text-xs uppercase tracking-widest font-medium bg-primary text-white">
                            {product.tag}
                        </span>
                    </div>
                )}
                <motion.div
                    initial={false}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center gap-3"
                >
                    <Link href={`/product/${product.id}`} className="px-6 py-3 bg-white text-foreground text-xs uppercase tracking-widest font-medium hover:bg-primary hover:text-white transition-colors">
                        Detayları Gör
                    </Link>
                </motion.div>
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><Heart size={18} /></button>
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><ShoppingBag size={18} /></button>
                </div>
            </div>
            <div className="px-1">
                <p className="text-xs text-primary uppercase tracking-widest mb-1.5">{product.category}</p>
                <h3 className="text-lg font-serif text-foreground mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-sm text-foreground/50 font-light mb-2">{product.shortDescription}</p>
                <p className="text-sm font-medium text-foreground/70">{product.price}</p>
            </div>
        </motion.div>
    );
};

// --- Filter Bar ---

const FilterBar = ({ productCount }: { productCount: number }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('default');

    return (
        <div className="bg-background/95 backdrop-blur-md border-b border-border py-4">
            <div className="container mx-auto px-6 flex items-center justify-between">
                <p className="text-sm text-foreground/50 font-light">
                    <span className="text-foreground font-medium">{productCount}</span> ürün bulundu
                </p>
                <div className="flex items-center gap-4">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent border border-border px-4 py-2 text-sm text-foreground/70 focus:outline-none focus:border-primary cursor-pointer">
                        <option value="default">Sıralama</option>
                        <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                        <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                        <option value="name">İsme Göre A-Z</option>
                    </select>
                    <div className="flex items-center border border-border">
                        <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-foreground/50 hover:text-foreground'}`}>
                            <Grid3x3 size={16} />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-foreground/50 hover:text-foreground'}`}>
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Page ---

import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProducts } from "@/lib/api";

export default function CategoryPage() {
    const { slug } = useParams();
    
    const { data: categories, isLoading: cLoading } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
    const { data: allProducts, isLoading: pLoading } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

    if (cLoading || pLoading) {
        return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
    }

    const category = categories?.find((c: any) => c.slug === slug);
    const products = allProducts?.filter((p: any) => p.category_id === category?.id && p.is_published) || [];

    const breadcrumbs = category ? [
        { label: category.name, href: null }
    ] : [];

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-serif mb-4">Kategori Bulunamadı</h1>
                    <Link href="/" className="text-primary hover:underline">Anasayfaya Dön</Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen font-sans">
            <Navbar variant="category" breadcrumbs={breadcrumbs} />
            <FilterBar productCount={products.length} />

            <div className="container mx-auto px-6 py-16">
                <div className={`grid gap-8 ${products.length >= 10 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5' : products.length > 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                    {products.map((product: any, index: number) => (
                        <ProductCard key={product.id} product={{
                            id: product.id,
                            name: product.title,
                            category: category.name,
                            categorySlug: category.slug,
                            price: product.base_price_without_fabric + " ₺",
                            images: product.images,
                            tag: "",
                            shortDescription: product.description.substring(0, 50) + "...",
                            description: product.description,
                            features: [],
                            dimensions: { width: "100", height: "100", depth: "100" },
                            colors: [],
                            fabrics: [],
                            woods: []
                        }} index={index} />
                    ))}
                </div>
            </div>

            <section className="py-24 md:py-32 bg-secondary text-secondary-foreground text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <img src={category.slug === 'salon' ? "/images/living-room.png" : category.slug === 'bahce' ? "/images/garden.png" : "/images/kitchen.png"} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-serif mb-6">Bu Koleksiyonu Keşfedin</h2>
                        <p className="text-lg text-secondary-foreground/70 font-light mb-10 leading-relaxed">
                            Bu kategoride hayalinizdeki parçayı bulabilirsiniz. Detaylı bilgi ve fiyat teklifi için showroom'umuzu ziyaret edin.
                        </p>
                        <Link href="/" className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-primary/90 transition-colors">
                            <span>Tüm Koleksiyonlar</span>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
import { Link } from "wouter";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import ProfileLayout from "@/components/ProfileLayout";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
    const { favorites, toggleFavorite } = useFavorites();
    const { data: products, isLoading } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

    const favoriteProducts = products?.filter((p: any) => favorites.includes(p.id)) || [];

    return (
        <ProfileLayout title="Favorilerim">
            <h1 className="text-2xl font-serif mb-6 text-gray-800">Favorilerim</h1>
            
            {isLoading ? (
                <div className="text-center py-12">Yükleniyor...</div>
            ) : favoriteProducts.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 p-8 text-center flex flex-col items-center justify-center">
                    <Heart size={32} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 mb-4 text-sm">Henüz favori ürününüz yok.</p>
                    <Link href="/" className="text-primary border border-primary px-4 py-2 uppercase text-xs font-medium hover:bg-primary hover:text-white transition-colors">
                        Alışverişe Başla
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 luxury-grid">
                    {favoriteProducts.map((product: any) => (
                        <div key={product.id} className="group relative">
                            <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden mb-5 bg-card">
                                <img src={product.images?.[0] || "/images/living-room.png"} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 z-10">
                                    <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.id); }}
                                        className="w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                                    >
                                        <Heart size={16} className="fill-current" />
                                    </button>
                                </div>
                            </Link>
                            <div className="px-1 mt-3">
                                <Link href={`/product/${product.id}`} className="block group-hover:text-primary transition-colors">
                                    <h3 className="text-lg md:text-xl font-sans font-semibold tracking-wide text-black mb-1.5 truncate">{product.title}</h3>
                                    <div className="flex flex-col mb-3">
                                        <span className="text-foreground/50 text-xs md:text-sm line-through">
                                            {(product.base_price_without_fabric * 1.1).toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + " TL"}
                                        </span>
                                        <span className="text-rose-700 font-bold text-base md:text-lg">
                                            Sepette: {product.base_price_without_fabric.toLocaleString('tr-TR') + " TL"}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ProfileLayout>
    );
}

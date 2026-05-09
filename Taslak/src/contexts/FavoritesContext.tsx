import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const localFavs = localStorage.getItem("rnconsept_favorites");
    if (localFavs) {
      try {
        setFavorites(JSON.parse(localFavs));
      } catch (e) {}
    }

    if (user) {
      const fetchFavs = async () => {
        try {
          const favDoc = await getDoc(doc(db, "favorites", user.uid));
          if (favDoc.exists()) {
            const dbFavs = favDoc.data().items || [];
            if (dbFavs.length > 0) {
              setFavorites(dbFavs);
              localStorage.setItem("rnconsept_favorites", JSON.stringify(dbFavs));
            }
          }
        } catch (error) {}
      };
      fetchFavs();
    }
  }, [user]);

  const saveFavs = async (items: string[]) => {
    setFavorites(items);
    localStorage.setItem("rnconsept_favorites", JSON.stringify(items));
    if (user) {
      try {
        await setDoc(doc(db, "favorites", user.uid), { items }, { merge: true });
      } catch (error) {}
    }
  };

  const toggleFavorite = async (productId: string) => {
    let newFavs = [...favorites];
    let isAdding = true;
    if (favorites.includes(productId)) {
      newFavs = favorites.filter(id => id !== productId);
      isAdding = false;
    } else {
      newFavs.push(productId);
    }
    await saveFavs(newFavs);
    if (isAdding) {
      toast({ title: "Favorilere Eklendi", description: "Ürün favorilerinize eklendi." });
    } else {
      toast({ title: "Favorilerden Çıkarıldı", description: "Ürün favorilerinizden çıkarıldı." });
    }
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

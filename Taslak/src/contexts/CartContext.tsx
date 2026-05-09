import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string; // Unique ID for this cart item (e.g. productId + selectedFabricId)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  fabricName?: string;
  isTeam?: boolean;
  setItems?: any[]; // Details if it's a team product
  isFreeShipping?: boolean;
  isFreeInstallation?: boolean;
  deliveryTimeWeeks?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalPrice: number;
  totalItems: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart
  useEffect(() => {
    // ALWAYS load from local storage first for instant feedback and as fallback
    const localCart = localStorage.getItem("rnconsept_cart");
    if (localCart) {
      try {
        setCartItems(JSON.parse(localCart));
      } catch (e) {}
    }

    if (user) {
      setIsLoading(true);
      const fetchCart = async () => {
        try {
          const cartDoc = await getDoc(doc(db, "carts", user.uid));
          if (cartDoc.exists()) {
            const dbItems = cartDoc.data().items || [];
            if (dbItems.length > 0) {
              setCartItems(dbItems);
              localStorage.setItem("rnconsept_cart", JSON.stringify(dbItems));
            }
          }
        } catch (error) {
          console.error("Cart fetch error (Firebase rules might be blocking):", error);
          // Fallback is already handled by localStorage above
        } finally {
          setIsLoading(false);
        }
      };
      fetchCart();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Save cart to Firestore and LocalStorage whenever it changes
  const saveCart = async (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("rnconsept_cart", JSON.stringify(items)); // ALWAYS save to local storage
    
    if (user) {
      try {
        await setDoc(doc(db, "carts", user.uid), { items }, { merge: true });
      } catch (error) {
        console.error("Error saving cart to db (Firebase rules might be blocking)", error);
      }
    }
  };

  const addToCart = async (item: CartItem) => {
    const existingIndex = cartItems.findIndex((i) => i.id === item.id);
    let newItems = [...cartItems];

    if (existingIndex >= 0) {
      newItems[existingIndex].quantity += item.quantity;
    } else {
      newItems.push(item);
    }

    await saveCart(newItems);
    toast({ title: "Sepete Eklendi", description: `${item.name} sepetinize başarıyla eklendi.` });
  };

  const removeFromCart = async (id: string) => {
    const newItems = cartItems.filter((i) => i.id !== id);
    await saveCart(newItems);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }
    const newItems = cartItems.map((i) => (i.id === id ? { ...i, quantity } : i));
    await saveCart(newItems);
  };

  const clearCart = async () => {
    await saveCart([]);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

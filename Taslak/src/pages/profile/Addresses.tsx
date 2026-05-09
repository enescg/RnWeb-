import { useState, useEffect } from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, MapPin, X } from "lucide-react";

export interface UserAddress {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
}

export default function ProfileAddresses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState("Ev Adresi");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const fetchAddresses = async () => {
    if (!user) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const q = query(collection(db, "addresses"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const data: UserAddress[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as UserAddress);
      });
      setAddresses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    if (user) {
      setFullName(user.displayName || "");
    }
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const newAddr = { userId: user.uid, title, fullName, phone, city, district, fullAddress };
      await addDoc(collection(db, "addresses"), newAddr);
      toast({ title: "Başarılı", description: "Adresiniz eklendi." });
      setIsAdding(false);
      // Reset form
      setTitle("Ev Adresi"); setPhone(""); setCity(""); setDistrict(""); setFullAddress("");
      fetchAddresses();
    } catch (error) {
      toast({ title: "Hata", description: "Adres eklenemedi.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "addresses", id));
      toast({ title: "Silindi", description: "Adresiniz silindi." });
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (error) {
      toast({ title: "Hata", description: "Adres silinemedi.", variant: "destructive" });
    }
  };

  return (
    <ProfileLayout title="Adreslerim">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-gray-800">Adreslerim</h1>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors uppercase tracking-wider">
            <Plus size={16} /> Yeni Ekle
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <h2 className="font-bold text-gray-700">Yeni Adres Ekle</h2>
            <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-red-500"><X size={20}/></button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Adres Başlığı (Ev, İş vb.)</label>
                <input required value={title} onChange={e=>setTitle(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-primary outline-none bg-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Ad Soyad</label>
                <input required value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-primary outline-none bg-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Telefon Numarası</label>
                <input required value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-primary outline-none bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">İl</label>
                  <input required value={city} onChange={e=>setCity(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-primary outline-none bg-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">İlçe</label>
                  <input required value={district} onChange={e=>setDistrict(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-primary outline-none bg-white" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Açık Adres</label>
              <textarea required value={fullAddress} onChange={e=>setFullAddress(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-primary outline-none min-h-[80px] bg-white" placeholder="Mahalle, sokak, bina no..."></textarea>
            </div>
            <div className="pt-2">
              <button type="submit" className="bg-[#3e4a52] text-white px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-[#2c353b]">Kaydet</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="py-12 text-center text-gray-500">Yükleniyor...</div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-300 bg-gray-50 rounded-lg">
              <MapPin size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4 text-sm">Kayıtlı bir adresiniz bulunmamaktadır.</p>
              <button onClick={() => setIsAdding(true)} className="text-primary border border-primary px-4 py-2 uppercase text-xs font-medium hover:bg-primary hover:text-white transition-colors">
                Yeni Adres Ekle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <div key={addr.id} className="border border-gray-200 p-5 rounded-lg relative bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                    <MapPin size={16} className="text-primary" />
                    <h3 className="font-bold text-gray-800">{addr.title}</h3>
                  </div>
                  <button onClick={() => handleDelete(addr.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-full transition-colors"><Trash2 size={14}/></button>
                  <p className="text-sm font-medium text-gray-800 mb-1">{addr.fullName}</p>
                  <p className="text-xs text-gray-500 mb-3">{addr.phone}</p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-1 line-clamp-2">{addr.fullAddress}</p>
                  <p className="text-xs text-gray-800 font-medium">{addr.district} / {addr.city}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </ProfileLayout>
  );
}

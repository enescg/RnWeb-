import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, X, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const { toast } = useToast();
    const [, setLocation] = useLocation();

    // Form States
    const [fullName, setFullName] = useState(user?.displayName || "");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState(user?.email || "");
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

    // New states
    const [userAddresses, setUserAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
    const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

    useEffect(() => {
        if (user) {
            const fetchAddrs = async () => {
                const q = query(collection(db, "addresses"), where("userId", "==", user.uid));
                const snap = await getDocs(q);
                const addrs: any[] = [];
                snap.forEach(doc => addrs.push({ id: doc.id, ...doc.data() }));
                setUserAddresses(addrs);
                if (addrs.length > 0) {
                    setSelectedAddressId(addrs[0].id);
                }
            };
            fetchAddrs();
        }
    }, [user]);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cartItems.length === 0) return;
        
        setIsSubmitting(true);
        try {
            let finalAddressInfo = { fullName, phone, email, address, note };
            
            if (user && selectedAddressId !== "new") {
                const addr = userAddresses.find(a => a.id === selectedAddressId);
                if (addr) {
                    finalAddressInfo = {
                        fullName: addr.fullName,
                        phone: addr.phone,
                        email: user.email || email,
                        address: `${addr.fullAddress} ${addr.district}/${addr.city}`,
                        note
                    };
                }
            }

            // Save Order to Firestore
            const orderData = {
                userId: user?.uid || "guest",
                customerInfo: finalAddressInfo,
                paymentMethod,
                items: cartItems,
                totalAmount: totalPrice,
                status: "beklemede",
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, "orders"), orderData);
            
            toast({ title: "Siparişiniz Alındı!", description: "Müşteri temsilcimiz sizinle iletişime geçecektir." });
            setOrderComplete(true);
            await clearCart();
        } catch (error) {
            console.error("Sipariş oluşturulamadı", error);
            toast({ title: "Hata", description: "Siparişiniz oluşturulurken bir hata oluştu.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderComplete) {
        return (
            <main className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
                <Navbar variant="category" />
                <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 mx-auto">
                        <ShieldCheck size={48} />
                    </div>
                    <h1 className="text-4xl font-serif text-gray-800 mb-4">Siparişiniz Başarıyla Alındı</h1>
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                        Tercihiniz için teşekkür ederiz. Siparişiniz başarıyla sistemimize düşmüştür. Müşteri temsilcimiz, sipariş detaylarınızı doğrulamak ve teslimat sürecini planlamak için en kısa sürede sizinle iletişime geçecektir.
                    </p>
                    <Link href="/">
                        <Button className="bg-[#3e4a52] hover:bg-[#2c353b] text-white px-8 h-12 rounded-sm font-bold tracking-wider uppercase">
                            Ana Sayfaya Dön
                        </Button>
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50/30 flex flex-col font-sans">
            <Navbar variant="category" breadcrumbs={[{ label: "Sepetim", href: null }]} />
            
            <div className="flex-1 container mx-auto px-4 md:px-6 py-12 md:py-20">
                <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-10 text-center md:text-left">Alışveriş Sepeti</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-gray-100 rounded-lg">
                        <ShoppingBag size={64} strokeWidth={1} className="mx-auto text-gray-300 mb-6" />
                        <h2 className="text-2xl font-medium text-gray-700 mb-4">Sepetiniz şu an boş.</h2>
                        <p className="text-gray-500 mb-8">Koleksiyonlarımızı keşfedip sepetinize ürün ekleyebilirsiniz.</p>
                        <Link href="/categories/salon">
                            <Button className="bg-[#3e4a52] hover:bg-[#2c353b] text-white px-10 h-12 rounded-sm font-bold tracking-wider uppercase">
                                ALIŞVERİŞE BAŞLA
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Sol Taraf: Ürünler */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-transparent">
                                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">SEPETİM ({cartItems.length} ürün)</h2>
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="bg-white border-b border-gray-200 last:border-b-0 py-6 relative">
                                            <button onClick={() => removeFromCart(item.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-full p-1">
                                                <X size={14} />
                                            </button>
                                            
                                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full pr-6">
                                                {/* Image */}
                                                <div className="w-24 h-16 sm:w-32 sm:h-20 shrink-0 border border-gray-100 overflow-hidden rounded-sm bg-gray-50">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Görsel Yok</div>
                                                    )}
                                                </div>

                                                {/* Title & SKU */}
                                                <div className="flex-1 min-w-[150px]">
                                                    <h3 className="text-sm font-bold text-gray-800 uppercase leading-snug">{item.name}</h3>
                                                    {item.fabricName && (
                                                        <p className="text-[11px] text-gray-500 mt-1">Kumaş: {item.fabricName}</p>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 lg:gap-8 w-full lg:w-auto mt-4 lg:mt-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                                                    {/* Delivery Date */}
                                                    <div className="w-28 flex flex-col justify-center">
                                                        <span className="text-xs font-bold text-gray-800">{item.deliveryTimeWeeks ? `${item.deliveryTimeWeeks} Hafta` : "Kısa Sürede"}</span>
                                                        <span className="text-[10px] text-gray-500">Ürünün Kargoda</span>
                                                    </div>

                                                    {/* Installation */}
                                                    <div className="w-28 flex flex-col justify-center items-center">
                                                        <Wrench size={14} className="text-gray-500 mb-1" />
                                                        <span className="text-[11px] font-bold text-gray-800">{item.isFreeInstallation !== false ? "Ücretsiz Kurulum" : "Ücretli Kurulum"}</span>
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="w-16 flex flex-col justify-center items-center">
                                                        <span className="text-[10px] text-gray-500 mb-1">Adet:</span>
                                                        <div className="flex items-center border border-gray-300 rounded-sm bg-white h-7">
                                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-1.5 hover:bg-gray-50 text-gray-600 h-full"><Minus size={10} /></button>
                                                            <span className="w-5 text-center text-xs font-semibold">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-1.5 hover:bg-gray-50 text-gray-600 h-full"><Plus size={10} /></button>
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="w-24 text-right">
                                                        <span className="text-sm font-bold text-primary">{(item.price * item.quantity).toLocaleString('tr-TR')} TL</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Extra Info Footer */}
                                            <div className="mt-4 pt-3 text-[11px] text-gray-500 space-y-1.5 pl-0 lg:pl-[144px]">
                                                <div className="flex items-start gap-2">
                                                    <div className="mt-0.5"><Wrench size={14} className="text-gray-400" /></div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Siparişe Özel Üretim:</span>
                                                        <span> Bu ürün, istekleriniz ve/veya kişisel ihtiyaçlarınız doğrultusundaki siparişinize istinaden özel olarak üretilecektir.</span>
                                                    </div>
                                                </div>
                                                {item.isTeam && item.setItems && (
                                                    <div className="pt-1 flex flex-wrap gap-1.5">
                                                        {item.setItems.map((setInfo: any, idx: number) => (
                                                            setInfo.quantity > 0 ? (
                                                                <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-600 border border-gray-200">
                                                                    {setInfo.quantity}x {setInfo.name} ({setInfo.selectedFabric})
                                                                </span>
                                                            ) : null
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Teslimat Bilgisi Banner */}
                            <div className="bg-[#f8f9fa] border border-gray-200 rounded-lg p-5 flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full text-primary shrink-0 shadow-sm">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-1">Ücretsiz Teslimat ve Kurulum</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Tüm Türkiye'ye (belirli uzak ilçeler hariç) nakliye ve uzman ekiplerimiz tarafından profesyonel kurulum hizmetimiz ücretsizdir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sağ Taraf: Sipariş Özeti ve Form */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
                                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Sipariş Özeti</h2>
                                
                                <div className="space-y-4 mb-6 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Ara Toplam</span>
                                        <span>{totalPrice.toLocaleString('tr-TR')} TL</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Teslimat Ücreti</span>
                                        <span className="text-green-600 font-medium">Ücretsiz</span>
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-100 pt-4 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-800 text-lg">Toplam</span>
                                        <span className="font-bold text-2xl text-primary">{totalPrice.toLocaleString('tr-TR')} TL</span>
                                    </div>
                                </div>

                                <form onSubmit={handleCheckout} className="space-y-5">
                                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-2">Teslimat Bilgileri</h3>
                                    
                                    {userAddresses.length > 0 && (
                                        <div className="mb-4">
                                            <Label className="text-gray-600 text-xs block mb-2">Kayıtlı Adresleriniz</Label>
                                            <select 
                                                value={selectedAddressId} 
                                                onChange={e => setSelectedAddressId(e.target.value)}
                                                className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:border-primary outline-none"
                                            >
                                                {userAddresses.map(addr => (
                                                    <option key={addr.id} value={addr.id}>{addr.title} ({addr.district}/{addr.city})</option>
                                                ))}
                                                <option value="new">+ Yeni Adres Gir</option>
                                            </select>
                                        </div>
                                    )}

                                    {(!user || selectedAddressId === "new") && (
                                        <div className="space-y-4 bg-gray-50 p-4 border border-gray-100 rounded-sm mb-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName" className="text-gray-600 text-xs">Ad Soyad</Label>
                                                <Input id="fullName" required value={fullName} onChange={e => setFullName(e.target.value)} className="h-10 text-sm bg-white" placeholder="Örn: Ahmet Yılmaz" />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="text-gray-600 text-xs">Telefon</Label>
                                                    <Input id="phone" required value={phone} onChange={e => setPhone(e.target.value)} className="h-10 text-sm bg-white" placeholder="05XX XXX XX XX" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-gray-600 text-xs">E-Posta</Label>
                                                    <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="h-10 text-sm bg-white" placeholder="ornek@mail.com" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="address" className="text-gray-600 text-xs">Açık Adres (İl, İlçe dahil)</Label>
                                                <Textarea id="address" required value={address} onChange={e => setAddress(e.target.value)} className="min-h-[80px] text-sm resize-none bg-white" placeholder="İl, ilçe, mahalle, sokak ve kapı no..." />
                                            </div>
                                        </div>
                                    )}

                                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mt-6 mb-2 pt-4 border-t border-gray-100">Ödeme Yöntemi</h3>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div 
                                            onClick={() => setPaymentMethod("bank_transfer")}
                                            className={`border ${paymentMethod === "bank_transfer" ? "border-primary bg-primary/5" : "border-gray-200 bg-white"} p-3 rounded-sm cursor-pointer text-center transition-colors`}
                                        >
                                            <p className={`text-sm font-bold ${paymentMethod === "bank_transfer" ? "text-primary" : "text-gray-600"}`}>Havale / EFT</p>
                                        </div>
                                        <div 
                                            onClick={() => setPaymentMethod("credit_card")}
                                            className={`border ${paymentMethod === "credit_card" ? "border-primary bg-primary/5" : "border-gray-200 bg-white"} p-3 rounded-sm cursor-pointer text-center transition-colors`}
                                        >
                                            <p className={`text-sm font-bold ${paymentMethod === "credit_card" ? "text-primary" : "text-gray-600"}`}>Kredi Kartı</p>
                                        </div>
                                    </div>
                                    
                                    {paymentMethod === "credit_card" && (
                                        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 text-xs rounded-sm mb-4">
                                            Kredi kartı ile ödeme entegrasyonu aşamasındadır. Lütfen Havale/EFT yöntemini seçiniz veya siparişinizi tamamlayıp temsilcimizin size ulaşmasını bekleyiniz.
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="note" className="text-gray-600 text-xs">Sipariş Notu (Opsiyonel)</Label>
                                        <Textarea id="note" value={note} onChange={e => setNote(e.target.value)} className="min-h-[60px] text-sm resize-none bg-white" placeholder="Belirtmek istediğiniz özel bir durum..." />
                                    </div>

                                    <div className="pt-2">
                                        <Button type="submit" disabled={isSubmitting} className="w-full bg-[#3e4a52] hover:bg-[#2c353b] text-white h-14 rounded-sm font-bold tracking-widest uppercase text-sm shadow-md transition-all">
                                            {isSubmitting ? "Sipariş Oluşturuluyor..." : "SİPARİŞİ TAMAMLA"}
                                            {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                                        </Button>
                                        <p className="text-[11px] text-gray-500 text-center mt-4">
                                            "Siparişi Tamamla" butonuna basarak Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesini onaylamış olursunuz.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <Footer />
        </main>
    );
}

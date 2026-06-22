import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, fetchCategories, saveProduct, uploadFile, deleteProduct } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: products, isLoading: loadingProducts } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const defaultState = {
    id: "",
    title: "",
    description: "",
    category_id: "1",
    base_price_without_fabric: 0,
    fabric_sqm_required: 0,
    default_fabric_id: "",
    is_published: true,
    images: [] as string[],
    manufacturer_name: "",
    manufacturer_contact: "",
    internal_notes: "",
    is_featured: false,
    is_free_shipping: true,
    is_free_installation: true,
    delivery_time_weeks: 4,
    delivery_info: "Tüm Türkiye'ye Ücretsiz Teslimat",
    installment_info: "Peşin fiyatına 3 taksit seçeneği",
    features: {
      fabric_info: "",
      function: "",
      skeleton: "",
      seating_inner: "",
      seating_softness: "",
      leg_material: "",
      leg_color: "",
      assembly_parts: "",
      fabric_material: "",
      extra_info: ""
    },
    set_items: [] as { id: string, name: string, description: string, base_price: number, fabric_sqm: number, leg_color: string, default_quantity: number, image_url?: string, dimensions?: { width: string, depth: string, height: string } }[]
  };

  const [formData, setFormData] = useState(defaultState);
  const [isEditing, setIsEditing] = useState(false);
  const [showManufacturerInfo, setShowManufacturerInfo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const saveMutation = useMutation({
    mutationFn: saveProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Başarılı", description: "Ürün kaydedildi." });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Başarılı", description: "Ürün silindi." });
    },
  });

  const resetForm = () => {
    setFormData(defaultState);
    setIsEditing(false);
    setShowManufacturerInfo(false);
  };

  const handleEdit = (product: any) => {
    setFormData({
      ...defaultState,
      ...product
    });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.set_items && payload.set_items.length > 0) {
        payload.base_price_without_fabric = payload.set_items.reduce((total, item) => total + (item.base_price * item.default_quantity), 0);
        payload.fabric_sqm_required = payload.set_items.reduce((total, item) => total + (item.fabric_sqm * item.default_quantity), 0);
    }
    saveMutation.mutate(payload);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isHero: boolean) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setIsUploading(true);
    
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadFile(file);
        urls.push(url);
      }
      
      const newImages = [...(formData.images || [])];
      
      if (isHero) {
        // Hero is images[0]
        if (newImages.length > 0) {
          newImages[0] = urls[0];
        } else {
          newImages.push(urls[0]);
        }
      } else {
        // Append to gallery
        // If hero doesn't exist, we must add a placeholder or the first gallery image becomes hero
        newImages.push(...urls);
      }
      
      setFormData({ ...formData, images: newImages });
      toast({ title: "Başarılı", description: "Görsel(ler) yüklendi." });
    } catch (err) {
      toast({ title: "Hata", description: "Görsel yüklenemedi.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      e.target.value = ''; // reset input
    }
  };

  const handleItemImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      const newItems = [...(formData.set_items || [])];
      newItems[idx].image_url = url;
      setFormData({ ...formData, set_items: newItems });
      toast({ title: "Başarılı", description: "Parça görseli yüklendi." });
    } catch (err) {
      toast({ title: "Hata", description: "Görsel yüklenemedi.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  if (loadingProducts) return <div>Yükleniyor...</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Form Alanı */}
      <div className="bg-white p-6 rounded-lg shadow-sm border w-full">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
            {isEditing ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
            </h2>
            {isEditing && (
              <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                <X size={16} className="mr-1"/> İptal
              </Button>
            )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Temel Bilgiler */}
          <div className="space-y-4">
              <div>
                <Label htmlFor="title">Ürün Adı</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="category">Kategori</Label>
                    <select
                    id="category"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    >
                    {categories?.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <Label htmlFor="delivery">Teslimat Bilgisi</Label>
                    <Input
                        id="delivery"
                        value={formData.delivery_info}
                        onChange={(e) => setFormData({ ...formData, delivery_info: e.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="delivery_time">Teslimat Süresi (Hafta)</Label>
                    <Input
                        id="delivery_time"
                        type="number"
                        value={formData.delivery_time_weeks}
                        onChange={(e) => setFormData({ ...formData, delivery_time_weeks: Number(e.target.value) })}
                    />
                </div>
                <div>
                    <Label htmlFor="installment">Taksit Seçenekleri</Label>
                    <Input
                        id="installment"
                        value={formData.installment_info}
                        onChange={(e) => setFormData({ ...formData, installment_info: e.target.value })}
                    />
                </div>
              </div>
          </div>

          <hr className="border-gray-100" />



          {/* Takım İçeriği */}
          <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <div>
                      <h3 className="text-lg font-semibold text-gray-800">Takım İçeriği (Parçalar)</h3>
                      <p className="text-xs text-gray-500">Ürünün tüm fiyat, kumaş ve özellikleri buradan parça parça tanımlanır.</p>
                  </div>
                  <Button type="button" variant="default" size="sm" onClick={() => {
                      setFormData({
                          ...formData,
                          set_items: [...(formData.set_items || []), { id: Date.now().toString(), name: "", description: "", base_price: 0, fabric_sqm: 0, leg_color: "", default_quantity: 1, dimensions: { width: "", depth: "", height: "" } }]
                      });
                  }}>
                      + Yeni Parça Ekle
                  </Button>
              </div>

              {(formData.set_items || []).length > 0 && (
                  <div className="space-y-4">
                      {(formData.set_items || []).map((item, idx) => (
                          <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                              <button type="button" onClick={() => {
                                  const newItems = [...formData.set_items];
                                  newItems.splice(idx, 1);
                                  setFormData({ ...formData, set_items: newItems });
                              }} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-1 rounded">
                                  <Trash2 size={16} />
                              </button>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                      <Label className="text-xs font-semibold">Parça Adı</Label>
                                      <Input className="h-9 bg-white" value={item.name} onChange={(e) => {
                                          const newItems = [...formData.set_items];
                                          newItems[idx].name = e.target.value;
                                          setFormData({ ...formData, set_items: newItems });
                                      }} placeholder="Örn: 3'lü Koltuk" required />
                                  </div>
                                  <div>
                                      <Label className="text-xs font-semibold">Ayak Seçenekleri (Virgülle ayırın, örn: Ahşap Siyah, Metal Altın)</Label>
                                      <Input className="h-9 bg-white" value={item.leg_color || ''} onChange={(e) => {
                                          const newItems = [...formData.set_items];
                                          newItems[idx].leg_color = e.target.value;
                                          setFormData({ ...formData, set_items: newItems });
                                      }} placeholder="Boş bırakılırsa varsayılan 5 Ahşap ve 5 Metal seçeneği sunulur." />
                                  </div>
                              </div>
                              
                              <div className="mb-4">
                                  <Label className="text-xs font-semibold block mb-2">Parça Görseli</Label>
                                  <div className="flex items-center gap-4">
                                      {item.image_url ? (
                                          <div className="relative w-16 h-16 border rounded bg-white flex items-center justify-center overflow-hidden shrink-0">
                                              <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                              <button type="button" onClick={() => {
                                                  const newItems = [...formData.set_items];
                                                  newItems[idx].image_url = undefined;
                                                  setFormData({ ...formData, set_items: newItems });
                                              }} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl">
                                                  <X size={12} />
                                              </button>
                                          </div>
                                      ) : null}
                                      <div className="flex-1">
                                          <Input type="file" accept="image/*" onChange={(e) => handleItemImageUpload(e, idx)} className="h-9 bg-white cursor-pointer" />
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-white p-3 border rounded">
                                  <div className="md:col-span-3"><Label className="text-xs font-semibold text-gray-500">Boyut Bilgileri</Label></div>
                                  <div>
                                      <Label className="text-xs">Genişlik</Label>
                                      <Input className="h-8 text-xs" value={item.dimensions?.width || ''} onChange={(e) => {
                                          const newItems = [...formData.set_items];
                                          newItems[idx].dimensions = { ...(newItems[idx].dimensions || {width: '', depth: '', height: ''}), width: e.target.value };
                                          setFormData({ ...formData, set_items: newItems });
                                      }} placeholder="Örn: 250 cm" />
                                  </div>
                                  <div>
                                      <Label className="text-xs">Derinlik</Label>
                                      <Input className="h-8 text-xs" value={item.dimensions?.depth || ''} onChange={(e) => {
                                          const newItems = [...formData.set_items];
                                          newItems[idx].dimensions = { ...(newItems[idx].dimensions || {width: '', depth: '', height: ''}), depth: e.target.value };
                                          setFormData({ ...formData, set_items: newItems });
                                      }} placeholder="Örn: 108 cm" />
                                  </div>
                                  <div>
                                      <Label className="text-xs">Yükseklik</Label>
                                      <Input className="h-8 text-xs" value={item.dimensions?.height || ''} onChange={(e) => {
                                          const newItems = [...formData.set_items];
                                          newItems[idx].dimensions = { ...(newItems[idx].dimensions || {width: '', depth: '', height: ''}), height: e.target.value };
                                          setFormData({ ...formData, set_items: newItems });
                                      }} placeholder="Örn: 75 cm" />
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  <div>
                                      <Label className="text-xs font-semibold">Fiyat (TL)</Label>
                                      <Input type="text" className="h-9 bg-white" value={item.base_price ? item.base_price.toLocaleString('tr-TR') : ''} onChange={(e) => {
                                          const val = e.target.value.replace(/\./g, '');
                                          if (!isNaN(Number(val))) {
                                              const newItems = [...formData.set_items];
                                              newItems[idx].base_price = Number(val);
                                              setFormData({ ...formData, set_items: newItems });
                                          }
                                      }} placeholder="Örn: 10.000" required />
                                  </div>
                                  <div>
                                      <Label className="text-xs font-semibold">Kumaş (m²)</Label>
                                      <Input type="number" step="0.1" className="h-9 bg-white" value={item.fabric_sqm} onChange={(e) => {
                                          const newItems = [...formData.set_items];
                                          newItems[idx].fabric_sqm = Number(e.target.value);
                                          setFormData({ ...formData, set_items: newItems });
                                      }} required />
                                  </div>
                                  <div>
                                      <Label className="text-xs font-semibold">Varsayılan Adet</Label>
                                      <Input type="number" className="h-9 bg-white" value={item.default_quantity} onChange={(e) => {
                                          const newItems = [...formData.set_items];
                                          newItems[idx].default_quantity = Number(e.target.value);
                                          setFormData({ ...formData, set_items: newItems });
                                      }} required />
                                  </div>
                              </div>
                              
                              <div>
                                  <Label className="text-xs font-semibold">Parça Açıklaması</Label>
                                  <textarea
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none"
                                    value={item.description}
                                    onChange={(e) => {
                                        const newItems = [...formData.set_items];
                                        newItems[idx].description = e.target.value;
                                        setFormData({ ...formData, set_items: newItems });
                                    }}
                                    placeholder="Bu parçaya özel ölçü veya özellikleri yazın..."
                                  />
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>

          <hr className="border-gray-100" />

          {/* Genel Ürün Özellikleri */}
          <div className="space-y-4">
              <div>
                  <h3 className="text-lg font-semibold text-gray-800">Genel Ürün Özellikleri</h3>
                  <p className="text-xs text-gray-500">Müşteri sayfasında 'Ürün Özellikleri' menüsü altında gösterilir.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Kumaş Bilgileri</Label><Input value={formData.features?.fabric_info || ''} onChange={e => setFormData({...formData, features: {...formData.features, fabric_info: e.target.value}})} placeholder="Örn: Polyester Bohem Kumaş" /></div>
                  <div><Label>Fonksiyon</Label><Input value={formData.features?.function || ''} onChange={e => setFormData({...formData, features: {...formData.features, function: e.target.value}})} placeholder="Örn: Sırt Mekanizmalı" /></div>
                  <div><Label>İskelet Malzemesi</Label><Input value={formData.features?.skeleton || ''} onChange={e => setFormData({...formData, features: {...formData.features, skeleton: e.target.value}})} placeholder="Örn: Kontra MDF Metal Parça Sunta" /></div>
                  <div><Label>Oturum İç Malzemesi</Label><Input value={formData.features?.seating_inner || ''} onChange={e => setFormData({...formData, features: {...formData.features, seating_inner: e.target.value}})} placeholder="Örn: Sünger" /></div>
                  <div><Label>Oturum Yumuşaklığı</Label><Input value={formData.features?.seating_softness || ''} onChange={e => setFormData({...formData, features: {...formData.features, seating_softness: e.target.value}})} placeholder="Örn: Orta Sert" /></div>
                  <div><Label>Ayak Malzemesi</Label><Input value={formData.features?.leg_material || ''} onChange={e => setFormData({...formData, features: {...formData.features, leg_material: e.target.value}})} placeholder="Örn: Ahşap" /></div>
                  <div><Label>Ayak Rengi</Label><Input value={formData.features?.leg_color || ''} onChange={e => setFormData({...formData, features: {...formData.features, leg_color: e.target.value}})} placeholder="Örn: Ceviz" /></div>
                  <div><Label>Demonte Parçalar</Label><Input value={formData.features?.assembly_parts || ''} onChange={e => setFormData({...formData, features: {...formData.features, assembly_parts: e.target.value}})} placeholder="Örn: Ayaklar demonte gönderilir." /></div>
                  <div><Label>Kumaş Malzemesi</Label><Input value={formData.features?.fabric_material || ''} onChange={e => setFormData({...formData, features: {...formData.features, fabric_material: e.target.value}})} placeholder="Örn: Polyester" /></div>
                  <div className="md:col-span-2"><Label>Ek Bilgiler</Label><Input value={formData.features?.extra_info || ''} onChange={e => setFormData({...formData, features: {...formData.features, extra_info: e.target.value}})} placeholder="Örn: Üçlü koltuk ile birlikte..." /></div>
              </div>
          </div>

          <hr className="border-gray-100" />

          {/* Görseller */}
          <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Ürün Görselleri</h3>
              
              <div className="grid grid-cols-2 gap-4">
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    <Label htmlFor="hero_upload" className="cursor-pointer block">
                        <Upload size={20} className="mx-auto text-gray-400 mb-2" />
                        <span className="text-xs font-medium text-gray-600 block mb-1">Ana Görsel (Hero) Yükle</span>
                        <span className="text-[10px] text-gray-400">Listeleme ve vitrin içindir</span>
                    </Label>
                    <input 
                        id="hero_upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, true)}
                        disabled={isUploading}
                    />
                  </div>
                  
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    <Label htmlFor="gallery_upload" className="cursor-pointer block">
                        <Upload size={20} className="mx-auto text-gray-400 mb-2" />
                        <span className="text-xs font-medium text-gray-600 block mb-1">Diğer Görselleri Yükle</span>
                        <span className="text-[10px] text-gray-400">Çoklu seçim yapabilirsiniz</span>
                    </Label>
                    <input 
                        id="gallery_upload" 
                        type="file" 
                        accept="image/*" 
                        multiple
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, false)}
                        disabled={isUploading}
                    />
                  </div>
              </div>

              {/* Thumbnail Previews */}
              {formData.images && formData.images.length > 0 && (
                  <div className="mt-4">
                      <Label className="text-xs text-gray-500 mb-2 block">Yüklenen Görseller (Sırala: İlk görsel Hero)</Label>
                      <div className="flex flex-wrap gap-2">
                          {formData.images.map((img, idx) => (
                              <div key={idx} className="relative group w-20 h-20 rounded overflow-hidden border border-gray-200">
                                  <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <button type="button" onClick={() => removeImage(idx)} className="text-white hover:text-red-400">
                                          <Trash2 size={16} />
                                      </button>
                                  </div>
                                  {idx === 0 && (
                                      <div className="absolute top-0 left-0 bg-primary text-white text-[9px] px-1 uppercase tracking-widest w-full text-center">
                                          Hero
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>

          <hr className="border-gray-100" />

          {/* Üretici Firma Bilgileri (Gizli) */}
          <div className="border border-gray-200 rounded-md overflow-hidden">
              <button 
                type="button" 
                className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-700"
                onClick={() => setShowManufacturerInfo(!showManufacturerInfo)}
              >
                  <span>Üretici Firma Bilgileri (Sadece Admin)</span>
                  {showManufacturerInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {showManufacturerInfo && (
                  <div className="p-4 space-y-4 bg-white">
                      <div>
                        <Label htmlFor="m_name" className="text-xs text-gray-500">Üretici / Tedarikçi Adı</Label>
                        <Input
                            id="m_name"
                            className="h-8 text-sm"
                            value={formData.manufacturer_name || ''}
                            onChange={(e) => setFormData({ ...formData, manufacturer_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="m_contact" className="text-xs text-gray-500">İrtibat Bilgileri (Tel, Adres vs.)</Label>
                        <Input
                            id="m_contact"
                            className="h-8 text-sm"
                            value={formData.manufacturer_contact || ''}
                            onChange={(e) => setFormData({ ...formData, manufacturer_contact: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="internal_notes" className="text-xs text-gray-500">Gizli Ürün Notları</Label>
                        <textarea
                            id="internal_notes"
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none"
                            value={formData.internal_notes || ''}
                            onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                            placeholder="Maliyet detayları, üretim süreleri vs..."
                        />
                      </div>
                  </div>
              )}
          </div>

          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="published">Yayında (Sitede Göster)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="featured">Öne Çıkan Ürün</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="free_shipping"
                checked={formData.is_free_shipping}
                onCheckedChange={(checked) => setFormData({ ...formData, is_free_shipping: checked })}
              />
              <Label htmlFor="free_shipping">Ücretsiz Teslimat Logosu</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="free_installation"
                checked={formData.is_free_installation}
                onCheckedChange={(checked) => setFormData({ ...formData, is_free_installation: checked })}
              />
              <Label htmlFor="free_installation">Ücretsiz Kurulum Logosu</Label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={saveMutation.isPending || isUploading}>
            {saveMutation.isPending ? "Kaydediliyor..." : isEditing ? "Değişiklikleri Kaydet" : "Ürünü Ekle"}
          </Button>
        </form>
      </div>

      {/* Liste Alanı */}
      <div className="bg-white p-6 rounded-lg shadow-sm border w-full overflow-x-auto h-fit overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Ürün Arşivi</h2>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b sticky top-0">
            <tr>
              <th className="px-4 py-3">Görsel</th>
              <th className="px-4 py-3">Adı</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Fiyat</th>
              <th className="px-4 py-3">Tedarikçi</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Öne Çıkan</th>
              <th className="px-4 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product: any) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                    {product.images && product.images[0] ? (
                        <div className="w-10 h-10 rounded overflow-hidden">
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">Yok</div>
                    )}
                </td>
                <td className="px-4 py-3 font-medium">{product.title}</td>
                <td className="px-4 py-3">{categories?.find((c: any) => c.id === product.category_id)?.name}</td>
                <td className="px-4 py-3">{product.base_price_without_fabric.toLocaleString('tr-TR')} TL</td>
                <td className="px-4 py-3">
                    {product.manufacturer_name ? (
                        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">{product.manufacturer_name}</span>
                    ) : "-"}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${product.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {product.is_published ? "Yayında" : "Gizli"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {product.is_featured ? (
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 font-medium">Öne Çıkan</span>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                      Düzenle
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => {
                        if(window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
                            deleteMutation.mutate(product.id);
                        }
                    }}>
                      Sil
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

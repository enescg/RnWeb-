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
    internal_notes: ""
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
    saveMutation.mutate(formData);
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

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  if (loadingProducts) return <div>Yükleniyor...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Alanı */}
      <div className="bg-white p-6 rounded-lg shadow-sm border lg:col-span-5 h-fit">
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
              <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="base_price">Çıplak Fiyat (₺)</Label>
                    <Input
                        id="base_price"
                        type="number"
                        value={formData.base_price_without_fabric}
                        onChange={(e) => setFormData({ ...formData, base_price_without_fabric: Number(e.target.value) })}
                        required
                    />
                </div>
              </div>
              <div>
                <Label htmlFor="sqm">Kumaş İhtiyacı (m²)</Label>
                <Input
                    id="sqm"
                    type="number"
                    step="0.1"
                    value={formData.fabric_sqm_required}
                    onChange={(e) => setFormData({ ...formData, fabric_sqm_required: Number(e.target.value) })}
                    required
                />
              </div>
              <div>
                <Label htmlFor="description">Ürün Açıklaması</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ürünün özelliklerini buraya yazın..."
                />
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

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
            <Label htmlFor="published">Yayında (Sitede Göster)</Label>
          </div>

          <Button type="submit" className="w-full" disabled={saveMutation.isPending || isUploading}>
            {saveMutation.isPending ? "Kaydediliyor..." : isEditing ? "Değişiklikleri Kaydet" : "Ürünü Ekle"}
          </Button>
        </form>
      </div>

      {/* Liste Alanı */}
      <div className="bg-white p-6 rounded-lg shadow-sm border lg:col-span-7 overflow-x-auto h-fit max-h-[85vh] overflow-y-auto">
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
                <td className="px-4 py-3">{product.base_price_without_fabric} ₺</td>
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

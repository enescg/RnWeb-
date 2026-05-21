import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFabrics, saveFabric, deleteFabric, uploadFile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

export default function AdminFabrics() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: fabrics, isLoading } = useQuery({
    queryKey: ["fabrics"],
    queryFn: fetchFabrics,
  });

  const [formData, setFormData] = useState({
    id: "",
    group_name: "",
    variant_name: "",
    price_per_sqm: 0,
    image_url: "",
    is_active: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      setFormData((prev) => ({ ...prev, image_url: url }));
      toast({ title: "Başarılı", description: "Kumaş görseli yüklendi." });
    } catch (err) {
      toast({ title: "Hata", description: "Görsel yüklenemedi.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const saveMutation = useMutation({
    mutationFn: saveFabric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fabrics"] });
      toast({ title: "Başarılı", description: "Kumaş kaydedildi." });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFabric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fabrics"] });
      toast({ title: "Başarılı", description: "Kumaş silindi." });
    },
  });

  const resetForm = () => {
    setFormData({
      id: "",
      group_name: "",
      variant_name: "",
      price_per_sqm: 0,
      image_url: "",
      is_active: true,
    });
    setIsEditing(false);
  };

  const handleEdit = (fabric: any) => {
    const gName = fabric.group_name || "";
    const variantPart = gName && fabric.name.startsWith(gName)
      ? fabric.name.slice(gName.length).trim()
      : fabric.name;

    setFormData({
      id: fabric.id || "",
      group_name: gName,
      variant_name: variantPart,
      price_per_sqm: fabric.price_per_sqm || 0,
      image_url: fabric.image_url || "",
      is_active: fabric.is_active !== false,
    });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = formData.group_name
      ? `${formData.group_name} ${formData.variant_name}`.trim()
      : formData.variant_name;

    saveMutation.mutate({
      id: formData.id,
      name: fullName,
      group_name: formData.group_name,
      price_per_sqm: formData.price_per_sqm,
      image_url: formData.image_url,
      is_active: formData.is_active,
    });
  };

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Form Alanı */}
      <div className="bg-white p-6 rounded-lg shadow-sm border col-span-1 h-fit">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Kumaş Düzenle" : "Yeni Kumaş Ekle"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="group_name">Kumaş Grubu / Genel Adı (Örn: Marble)</Label>
            <Input
              id="group_name"
              value={formData.group_name}
              onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
              placeholder="Ortak grup adı (örn: Marble)"
            />
          </div>
          <div>
            <Label htmlFor="variant_name">Renk / Versiyon (Örn: Krem, Antrasit)</Label>
            <Input
              id="variant_name"
              value={formData.variant_name}
              onChange={(e) => setFormData({ ...formData, variant_name: e.target.value })}
              required
              placeholder="Örn: Krem veya Antrasit"
            />
          </div>
          <div>
            <Label htmlFor="price">m² Fiyatı ($)</Label>
            <Input
              id="price"
              type="text"
              value={formData.price_per_sqm ? formData.price_per_sqm.toLocaleString('tr-TR') : ''}
              onChange={(e) => {
                  const val = e.target.value.replace(/\./g, '');
                  if (!isNaN(Number(val))) {
                      setFormData({ ...formData, price_per_sqm: Number(val) });
                  }
              }}
              required
              placeholder="Örn: 1.500"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Kumaş Görseli</Label>
            <div className="mt-2 space-y-4">
              {formData.image_url ? (
                <div className="relative w-full aspect-square border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden group">
                  <img src={formData.image_url} alt="Kumaş Önizleme" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: "" })}
                      className="text-white hover:text-red-400 bg-red-600/80 p-2 rounded-full transition-transform hover:scale-110"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50/50">
                  <Label htmlFor="fabric_image_upload" className="cursor-pointer block">
                    <Upload size={28} className="mx-auto text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600 block mb-1">Görsel Yükle</span>
                    <span className="text-xs text-gray-400">Dosya seçmek için tıklayın</span>
                  </Label>
                  <input
                    id="fabric_image_upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
              )}
              {isUploading && (
                <div className="text-xs text-primary font-medium animate-pulse text-center">
                  Görsel yükleniyor, lütfen bekleyin...
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
            <Label htmlFor="active">Aktif (Sitede Göster)</Label>
          </div>
          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1" disabled={saveMutation.isPending || isUploading}>
              {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={resetForm}>
                İptal
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Liste Alanı */}
      <div className="bg-white p-6 rounded-lg shadow-sm border col-span-2">
        <h2 className="text-xl font-semibold mb-4">Mevcut Kumaşlar</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3">Görsel</th>
                <th className="px-4 py-3">Adı</th>
                <th className="px-4 py-3">Grup</th>
                <th className="px-4 py-3">m² Fiyatı</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {fabrics?.map((fabric: any) => (
                <tr key={fabric.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {fabric.image_url && (
                      <img src={fabric.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{fabric.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-medium">{fabric.group_name || "-"}</td>
                  <td className="px-4 py-3">{fabric.price_per_sqm.toLocaleString('tr-TR')} $</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        fabric.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {fabric.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(fabric)}>
                      Düzenle
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Silmek istediğinize emin misiniz?")) {
                          deleteMutation.mutate(fabric.id);
                        }
                      }}
                    >
                      Sil
                    </Button>
                  </td>
                </tr>
              ))}
              {fabrics?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Henüz kumaş eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

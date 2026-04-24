import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFabrics, saveFabric, deleteFabric } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function AdminFabrics() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: fabrics, isLoading } = useQuery({
    queryKey: ["fabrics"],
    queryFn: fetchFabrics,
  });

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price_per_sqm: 0,
    image_url: "",
    is_active: true,
  });
  const [isEditing, setIsEditing] = useState(false);

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
      name: "",
      price_per_sqm: 0,
      image_url: "",
      is_active: true,
    });
    setIsEditing(false);
  };

  const handleEdit = (fabric: any) => {
    setFormData(fabric);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
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
            <Label htmlFor="name">Kumaş Adı</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">m² Fiyatı (₺)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price_per_sqm}
              onChange={(e) =>
                setFormData({ ...formData, price_per_sqm: Number(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Görsel URL</Label>
            <Input
              id="image"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              placeholder="/images/fabric.png"
            />
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
            <Button type="submit" className="flex-1" disabled={saveMutation.isPending}>
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
                  <td className="px-4 py-3">{fabric.price_per_sqm} ₺</td>
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
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
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

import ProfileLayout from "@/components/ProfileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function ProfileInfo() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("kadin");
  const [newsletter, setNewsletter] = useState("onayliyorum");
  const [isLoading, setIsLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const nameParts = user.displayName?.split(" ") || ["", ""];
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");

      const fetchUserData = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.phone) setPhone(data.phone);
            if (data.gender) setGender(data.gender);
            if (data.newsletter) setNewsletter(data.newsletter);
          }
        } catch (error) {
          console.error("Kullanıcı verisi çekilemedi", error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Update Auth Profile
      await updateProfile(user, { displayName: `${firstName} ${lastName}`.trim() });
      
      // Update Firestore Document
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        phone,
        gender,
        newsletter,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      toast({ title: "Başarılı", description: "Bilgileriniz güncellendi." });
    } catch (error: any) {
      toast({ title: "Hata", description: "Bilgiler güncellenirken bir hata oluştu.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user || !user.email) return;
    if (newPassword !== newPasswordConfirm) {
      toast({ title: "Hata", description: "Yeni şifreler eşleşmiyor.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Hata", description: "Yeni şifre en az 6 karakter olmalıdır.", variant: "destructive" });
      return;
    }

    setIsPasswordLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      toast({ title: "Başarılı", description: "Şifreniz başarıyla güncellendi." });
      setOldPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (error: any) {
      console.error(error);
      let message = "Şifre güncellenirken bir hata oluştu.";
      if (error.code === "auth/invalid-credential") message = "Mevcut şifreniz hatalı.";
      toast({ title: "Hata", description: message, variant: "destructive" });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <ProfileLayout title="Bilgilerim">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* ÜYELİK BİLGİLERİM */}
        <div className="flex-1 space-y-8">
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-800 border-b border-gray-100 pb-3">
            ÜYELİK BİLGİLERİM
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-600 text-sm">Ad</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-11 rounded-sm border-gray-300 focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-600 text-sm">Soyad</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-11 rounded-sm border-gray-300 focus-visible:ring-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-600 text-sm">E-Posta Adresi</Label>
            <Input id="email" type="email" value={user?.email || ""} disabled className="h-11 rounded-sm border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed" />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-600 text-sm">Cinsiyet</Label>
            <RadioGroup value={gender} onValueChange={setGender} className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kadin" id="kadin" className="border-gray-400 text-primary" />
                <Label htmlFor="kadin" className="font-normal cursor-pointer">Kadın</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="erkek" id="erkek" className="border-gray-400 text-primary" />
                <Label htmlFor="erkek" className="font-normal cursor-pointer">Erkek</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-bold text-gray-800 uppercase text-sm">İletişim bilgileri</h3>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-600 text-sm">Cep Telefonu</Label>
              <div className="flex">
                <div className="flex items-center justify-center bg-gray-100 border border-r-0 border-gray-300 px-4 rounded-l-sm text-sm text-gray-600">
                  +90
                </div>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="5XX XXX XX XX" className="h-11 rounded-l-none rounded-r-sm border-gray-300 focus-visible:ring-primary flex-1" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <Label className="text-gray-600 text-sm leading-relaxed block">
              Kampanyalardan haberdar olmak için Ticari Elektronik İleti almayı onaylıyor musunuz?
            </Label>
            <RadioGroup value={newsletter} onValueChange={setNewsletter} className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="onayliyorum" id="onayliyorum" className="border-gray-400 text-primary" />
                <Label htmlFor="onayliyorum" className="font-normal cursor-pointer">Onaylıyorum</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="onaylamiyorum" id="onaylamiyorum" className="border-gray-400 text-primary" />
                <Label htmlFor="onaylamiyorum" className="font-normal cursor-pointer">Onaylamıyorum</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-6">
            <Button onClick={handleUpdateProfile} disabled={isLoading} className="bg-[#3e4a52] hover:bg-[#2c353b] text-white w-full md:w-auto px-10 h-12 rounded-sm font-bold tracking-wider uppercase">
              {isLoading ? "Güncelleniyor..." : "GÜNCELLE"}
            </Button>
          </div>
        </div>

        {/* ŞİFRE GÜNCELLEME */}
        <div className="flex-1 space-y-8 lg:max-w-md">
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-800 border-b border-gray-100 pb-3">
            ŞİFRE GÜNCELLEME
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword" className="text-gray-600 text-sm">Mevcut Şifre</Label>
              <Input id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} type="password" className="h-11 rounded-sm border-gray-300 focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-gray-600 text-sm">Yeni Şifre</Label>
              <Input id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="h-11 rounded-sm border-gray-300 focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPasswordConfirm" className="text-gray-600 text-sm">Yeni Şifre (Tekrar)</Label>
              <Input id="newPasswordConfirm" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} type="password" className="h-11 rounded-sm border-gray-300 focus-visible:ring-primary" />
            </div>
          </div>

          <div className="pt-6">
            <Button onClick={handleUpdatePassword} disabled={isPasswordLoading} className="bg-[#3e4a52] hover:bg-[#2c353b] text-white w-full h-12 rounded-sm font-bold tracking-wider uppercase">
              {isPasswordLoading ? "Bekleyiniz..." : "ŞİFREYİ GÜNCELLE"}
            </Button>
          </div>
        </div>

      </div>
    </ProfileLayout>
  );
}

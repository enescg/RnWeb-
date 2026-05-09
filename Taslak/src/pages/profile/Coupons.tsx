import ProfileLayout from "@/components/ProfileLayout";

export default function ProfileCoupons() {
  return (
    <ProfileLayout title="Kuponlarım">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-foreground/60">Şu anda aktif bir kuponunuz bulunmamaktadır.</p>
      </div>
    </ProfileLayout>
  );
}

import ProfileLayout from "@/components/ProfileLayout";
import { Link } from "wouter";
import { Sofa, Sparkles } from "lucide-react";

export default function ProfileOrders() {
  return (
    <ProfileLayout title="Siparişlerim">
      <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
        
        {/* Empty State Icon */}
        <div className="relative mb-8 text-primary flex items-center justify-center">
          <Sofa size={96} strokeWidth={1} />
          <Sparkles size={28} className="absolute -top-4 -right-4 text-primary/70" strokeWidth={1.5} />
          <Sparkles size={16} className="absolute top-2 -left-4 text-primary/50" strokeWidth={1.5} />
          <Sparkles size={20} className="absolute -top-6 left-1/2 -translate-x-1/2 text-primary/60" strokeWidth={1.5} />
        </div>

        <h2 className="text-lg md:text-xl font-bold text-[#333333] uppercase tracking-wide mb-4">
          HENÜZ HİÇ SİPARİŞİN YOK!
        </h2>
        
        <p className="text-[#555555] mb-8 max-w-md mx-auto leading-relaxed text-sm md:text-base">
          Mobilyadan dekoratif objelere, aydınlatmadan ev tekstiline geniş ürün yelpazemizi hemen keşfetmeye başla!
        </p>
        
        <Link 
          href="/categories/salon" 
          className="bg-[#3e4a52] text-white px-8 py-3.5 rounded-sm font-bold uppercase tracking-wider text-sm hover:bg-[#2c353b] transition-colors"
        >
          ALIŞVERİŞE BAŞLA
        </Link>
        
      </div>
    </ProfileLayout>
  );
}

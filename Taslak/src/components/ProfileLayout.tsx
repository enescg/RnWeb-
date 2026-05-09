import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useLocation } from "wouter";
import { ChevronRight } from "lucide-react";

interface ProfileLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function ProfileLayout({ children, title }: ProfileLayoutProps) {
  const [location] = useLocation();

  const links = [
    { href: "/profile/orders", label: "Siparişlerim" },
    { href: "/profile/coupons", label: "Kuponlarım" },
    { href: "/profile/info", label: "Bilgilerim" },
    { href: "/profile/addresses", label: "Adreslerim" },
    { href: "/profile/favorites", label: "Favorilerim" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar variant="category" />
      <div className="flex-1 container mx-auto max-w-6xl px-4 py-16 flex flex-col md:flex-row items-start gap-8 lg:gap-16">
        
        {/* Sidebar Menu */}
        <aside className="w-full md:w-60 flex-shrink-0" style={{ maxWidth: "250px", flexBasis: "250px" }}>
          <h3 className="text-base font-bold tracking-widest uppercase mb-4 text-gray-800">
            HESABIM
          </h3>
          <nav className="flex flex-col">
            {links.map((link) => {
              const isActive = location === link.href;
              return (
                <Link 
                  key={link.label}
                  href={link.href} 
                  className={`flex items-center justify-between py-3 border-b border-gray-100 transition-colors text-sm ${isActive ? "text-gray-900 font-bold" : "text-gray-500 hover:text-gray-900"}`}
                >
                  <span>{link.label}</span>
                  {isActive && <ChevronRight size={16} className="text-gray-500" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0 pt-2 md:pt-0">
          {children}
        </main>

      </div>
      <Footer />
    </div>
  );
}

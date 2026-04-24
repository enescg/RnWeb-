import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

// --- Breadcrumb Component ---

interface BreadcrumbItem {
    label: string;
    href: string | null;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <div className="bg-secondary/50 py-4 border-b border-border">
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
                    <Link href="/" className="text-foreground/50 hover:text-primary transition-colors">
                        Anasayfa
                    </Link>
                    {items.map((item, index) => (
                        <span key={index} className="flex items-center gap-2">
                            <ChevronRight size={12} className="text-foreground/30" />
                            {item.href !== null ? (
                                <Link href={item.href} className="text-foreground/50 hover:text-primary transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-foreground font-medium">{item.label}</span>
                            )}
                        </span>
                    ))}
                </div>

                {/* Logo */}
                <Link href="/" className="text-white">
                    <span className="text-xl font-serif tracking-widest uppercase">RN Consept</span>
                </Link>
            </div>
        </div>
    );
};

export default Breadcrumb;
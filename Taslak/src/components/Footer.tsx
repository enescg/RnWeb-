import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="section-gradient-alt pt-24 pb-12 border-t border-border/30" id="iletisim">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <img
              src="/images/logo.png"
              alt="RN Consept"
              className="h-16 w-auto object-contain mb-6"
              style={{ mixBlendMode: "screen" }}
            />
            <p className="text-foreground/60 font-light max-w-sm mb-8 leading-relaxed">
              Modern Türk tasarımının dünya standartlarında lüks ile buluştuğu nokta. Zamansız tasarımlar, eşsiz işçilik.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" data-testid="link-instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" data-testid="link-facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" data-testid="link-twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6">Keşfedin</h4>
            <ul className="space-y-4 font-light text-foreground/70">
              <li><a href="/#koleksiyonlar" className="hover:text-primary transition-colors">Koleksiyonlar</a></li>
              <li><a href="/#one-cikanlar" className="hover:text-primary transition-colors">İmza Parçalar</a></li>
              <li><a href="/#ozellestirme" className="hover:text-primary transition-colors">Kişiselleştirme</a></li>
              <li><a href="/#zanaat" className="hover:text-primary transition-colors">Ustalık ve Zanaat</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6">Bülten</h4>
            <p className="text-foreground/60 font-light mb-6">Yeni koleksiyonlardan ve özel davetlerden haberdar olun.</p>
            <form className="flex flex-col space-y-4" onSubmit={(e) => e.preventDefault()} data-testid="form-newsletter">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="bg-transparent border-b border-border py-3 px-0 w-full focus:outline-none focus:border-primary font-light transition-colors"
                data-testid="input-email"
              />
              <button
                type="submit"
                className="bg-foreground text-background py-3 font-medium tracking-wider uppercase text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="button-submit-newsletter"
              >
                Kayıt Ol
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/40 font-light">
          <p>&copy; {new Date().getFullYear()} RN Consept. Tüm hakları saklıdır.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-foreground transition-colors">Kullanım Şartları</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

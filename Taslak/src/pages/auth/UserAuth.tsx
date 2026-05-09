import { useState } from 'react';
import { useLocation } from 'wouter';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Giriş Başarılı', description: 'Hoş geldiniz.' });
        setLocation('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        toast({ title: 'Kayıt Başarılı', description: 'Hesabınız oluşturuldu ve giriş yapıldı.' });
        setLocation('/');
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: error.message || 'Bir sorun oluştu.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar variant="category" />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-card p-8 border border-border shadow-sm">
          <div>
            <h2 className="text-center text-3xl font-serif text-foreground uppercase tracking-widest">
              {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <Input
                    type="text"
                    required
                    placeholder="Ad Soyad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent"
                  />
                </div>
              )}
              <div>
                <Input
                  type="email"
                  required
                  placeholder="E-posta Adresi"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent"
                />
              </div>
              <div>
                <Input
                  type="password"
                  required
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full uppercase tracking-wider" disabled={loading}>
                {loading ? 'İşleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </Button>
            </div>
          </form>
          
          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              {isLogin
                ? 'Hesabınız yok mu? Kayıt Olun'
                : 'Zaten hesabınız var mı? Giriş Yapın'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

import { supabase, Category } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Coffee, Heart, Gift, Wrench, ShoppingCart, User } from 'lucide-react';
import { CartButton } from '@/components/cart-button';
import { BottomNav } from '@/components/bottom-nav';

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data || [];
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-primary">SIDA</span>
              <span className="text-text-primary"> Caffè</span>
            </h1>
            <p className="text-xs text-text-secondary">Consegna a domicilio</p>
          </div>
          <div className="flex items-center gap-2">
            <CartButton />
            <Link href="/admin" className="p-2 rounded-full bg-surface hover:bg-surface-highlight transition-colors">
              <User size={20} className="text-text-secondary" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl p-6 border border-primary/30">
          <Coffee size={40} className="text-primary mb-3" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Benvenuto!</h2>
          <p className="text-text-secondary text-sm">
            Sfoglia il nostro catalogo e ordina comodamente da casa.
            Pagamento alla consegna.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-lg mx-auto px-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Categorie</h3>
        
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Coffee size={48} className="text-text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary">Nessuna categoria disponibile</p>
            <p className="text-text-secondary text-sm mt-1">Contatta l'admin per aggiungere prodotti</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="bg-surface rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="aspect-square relative bg-surface-highlight">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Coffee size={40} className="text-primary/50" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-text-primary text-sm truncate">
                    {category.name}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}

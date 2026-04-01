import { supabase, Promotion } from '@/lib/supabase';
import Image from 'next/image';
import { Gift } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';
import { CartButton } from '@/components/cart-button';

async function getPromotions(): Promise<Promotion[]> {
  const { data } = await supabase
    .from('promotions')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });
  return data || [];
}

export const revalidate = 60;

export default async function PromotionsPage() {
  const promotions = await getPromotions();

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift size={24} className="text-primary" />
            <h1 className="text-lg font-bold text-text-primary">Promozioni</h1>
          </div>
          <CartButton />
        </div>
      </header>

      <section className="max-w-lg mx-auto px-4 py-6">
        {promotions.length === 0 ? (
          <div className="text-center py-12">
            <Gift size={64} className="text-text-secondary mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-text-primary mb-2">Nessuna promozione</h2>
            <p className="text-text-secondary">Torna presto per scoprire le nuove offerte!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {promotions.map((promo) => (
              <div key={promo.id} className="bg-surface rounded-xl overflow-hidden border border-primary/30">
                {promo.image && (
                  <div className="aspect-video relative">
                    <Image src={promo.image} alt={promo.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-text-primary text-lg mb-2">{promo.title}</h3>
                  {promo.description && (
                    <p className="text-text-secondary text-sm">{promo.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}

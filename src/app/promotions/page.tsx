import { supabase, Promotion } from '@/lib/supabase';
import Image from 'next/image';
import { BottomNav } from '@/components/bottom-nav';
import { CartBar } from '@/components/cart-bar';

async function getPromotions(): Promise<Promotion[]> {
  const { data } = await supabase
    .from('promotions')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });
  return data || [];
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function PromotionsPage() {
  const promotions = await getPromotions();

  return (
    <main className="mobile-container pb-safe" style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ padding: '20px 20px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2">
            <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/>
            <circle cx="17" cy="7" r="5"/>
          </svg>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#F5F5F0' }}>Promozioni</h1>
        </div>
      </header>

      {/* Content */}
      <section style={{ padding: '0 16px' }}>
        {promotions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2A2A2A" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
              <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/>
              <circle cx="17" cy="7" r="5"/>
            </svg>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#F5F5F0', marginBottom: '8px' }}>Nessuna promozione</h2>
            <p style={{ fontSize: '14px', color: '#888' }}>Torna presto per scoprire le nuove offerte!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {promotions.map((promo) => (
              <div
                key={promo.id}
                style={{
                  backgroundColor: '#121212',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                {promo.image && (
                  <div style={{ aspectRatio: '16/9', position: 'relative' }}>
                    <Image src={promo.image} alt={promo.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontWeight: 700, color: '#F5F5F0', fontSize: '18px', marginBottom: '8px' }}>{promo.title}</h3>
                  {promo.description && (
                    <p style={{ color: '#A3A3A3', fontSize: '14px', lineHeight: 1.5 }}>{promo.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <CartBar />
      <BottomNav />
    </main>
  );
}

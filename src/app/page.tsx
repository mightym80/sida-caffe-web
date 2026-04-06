import Link from 'next/link';
import Image from 'next/image';
import { CartBar } from '@/components/cart-bar';
import { BottomNav } from '@/components/bottom-nav';

const SUPABASE_URL = 'https://wyvcwibhcayassfqgofh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7rHj-FAXCRRI93wBhJSwfg_Zq2k568V';

interface Category {
  id: string;
  name: string;
  image: string;
  display_order: number;
  active: boolean;
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/categories?active=eq.true&order=display_order.asc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        cache: 'no-store',
      }
    );
    
    if (!response.ok) {
      console.error('Supabase error:', response.status);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <main className="mobile-container pb-safe" style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ padding: '20px 20px 12px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '34px', fontWeight: 900, color: '#38BDF8', letterSpacing: '6px' }}>SIDA</span>
              <span style={{ fontSize: '26px', fontWeight: 300, color: '#F5F5F0', fontStyle: 'italic', letterSpacing: '2px', marginLeft: '8px' }}>Caffè</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', marginBottom: '4px', maxWidth: '180px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#38BDF8', opacity: 0.4 }} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
              </svg>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#38BDF8', opacity: 0.4 }} />
            </div>
            <p style={{ fontSize: '11px', color: '#888', letterSpacing: '3px', textTransform: 'uppercase' }}>Consegna a domicilio</p>
          </div>
          <Link 
            href="/admin" 
            style={{
              padding: '10px',
              borderRadius: '50%',
              backgroundColor: '#121212',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '4px',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Categories Grid */}
      <section style={{ padding: '0 12px', marginTop: '8px' }}>
        {categories.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 40px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2A2A2A" strokeWidth="1.5">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            </svg>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#F5F5F0', marginTop: '16px' }}>Nessuna categoria</h2>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '8px', textAlign: 'center' }}>I prodotti saranno disponibili a breve</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="touch-active"
                style={{
                  backgroundColor: '#121212',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #2A2A2A',
                  textDecoration: 'none',
                }}
              >
                <div style={{ width: '100%', aspectRatio: '4/3', position: 'relative', backgroundColor: '#1E1E1E' }}>
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2">
                        <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
                        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div style={{ padding: '12px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#F5F5F0', textAlign: 'center' }}>
                    {category.name}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <CartBar />
      <BottomNav />
    </main>
  );
}

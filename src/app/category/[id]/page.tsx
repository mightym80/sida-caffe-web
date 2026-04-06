import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { BottomNav } from '@/components/bottom-nav';
import { CartBar } from '@/components/cart-bar';

const SUPABASE_URL = 'https://wyvcwibhcayassfqgofh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7rHj-FAXCRRI93wBhJSwfg_Zq2k568V';

interface Category {
  id: string;
  name: string;
  image: string;
}

interface Product {
  id: string;
  category_id: string;
  name: string;
  image: string;
  description: string;
  display_order: number;
  active: boolean;
}

async function getCategory(id: string): Promise<Category | null> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/categories?id=eq.${id}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        cache: 'no-store',
      }
    );
    const data = await response.json();
    return data?.[0] || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getProducts(categoryId: string): Promise<Product[]> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?category_id=eq.${categoryId}&active=eq.true&order=display_order.asc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        cache: 'no-store',
      }
    );
    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, products] = await Promise.all([
    getCategory(id),
    getProducts(id),
  ]);

  if (!category) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#A3A3A3' }}>Categoria non trovata</p>
      </main>
    );
  }

  return (
    <main className="mobile-container pb-safe" style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 40, 
        backgroundColor: 'rgba(5, 5, 5, 0.95)', 
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #2A2A2A',
        padding: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '480px', margin: '0 auto' }}>
          <Link 
            href="/" 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              backgroundColor: '#121212',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#F5F5F0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{category.name}</h1>
            <p style={{ fontSize: '12px', color: '#A3A3A3', margin: '2px 0 0 0' }}>{products.length} prodotti</p>
          </div>
        </div>
      </header>

      {/* Products */}
      <section style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2A2A2A" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            </svg>
            <p style={{ color: '#A3A3A3', fontSize: '15px' }}>Nessun prodotto disponibile</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <CartBar />
      <BottomNav />
    </main>
  );
}

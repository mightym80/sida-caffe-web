import { supabase, Category, Product } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Coffee } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { CartButton } from '@/components/cart-button';
import { BottomNav } from '@/components/bottom-nav';

async function getCategory(id: string): Promise<Category | null> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

async function getProducts(categoryId: string): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('active', true)
    .order('display_order', { ascending: true });
  return data || [];
}

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, products] = await Promise.all([
    getCategory(id),
    getProducts(id),
  ]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary">Categoria non trovata</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full bg-surface hover:bg-surface-highlight transition-colors">
            <ArrowLeft size={20} className="text-text-primary" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-text-primary truncate">{category.name}</h1>
            <p className="text-xs text-text-secondary">{products.length} prodotti</p>
          </div>
          <CartButton />
        </div>
      </header>

      {/* Products */}
      <section className="max-w-lg mx-auto px-4 py-4">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Coffee size={48} className="text-text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary">Nessun prodotto disponibile</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}

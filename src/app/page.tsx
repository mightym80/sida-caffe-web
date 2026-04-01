import { supabase, Category } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Coffee, Settings } from 'lucide-react';
import { CartBar } from '@/components/cart-bar';
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

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-[#050505] pb-24">
      {/* Header */}
      <header className="px-5 pt-5 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-baseline">
              <span className="text-[32px] font-black text-[#38BDF8] tracking-[4px]">SIDA</span>
              <span className="text-[24px] font-light text-[#F5F5F0] italic tracking-[1px] ml-2">Caffè</span>
            </div>
            <div className="flex items-center gap-2 mt-1 mb-2 max-w-[200px]">
              <div className="flex-1 h-[1px] bg-[#38BDF8] opacity-50"></div>
              <Coffee size={14} className="text-[#38BDF8]" />
              <div className="flex-1 h-[1px] bg-[#38BDF8] opacity-50"></div>
            </div>
            <p className="text-[12px] text-[#888888] tracking-[3px] uppercase">Consegna a domicilio</p>
          </div>
          <Link 
            href="/admin" 
            className="p-2.5 rounded-full bg-[#121212] mt-1"
          >
            <Settings size={22} className="text-[#666666]" />
          </Link>
        </div>
      </header>

      {/* Categories Grid */}
      <section className="px-3 mt-2">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-10">
            <Coffee size={64} className="text-[#2A2A2A] mb-4" />
            <h2 className="text-[20px] font-semibold text-[#F5F5F0] mb-2">Nessuna categoria</h2>
            <p className="text-[14px] text-[#888888] text-center">I prodotti saranno disponibili a breve</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="bg-[#121212] rounded-2xl overflow-hidden border border-[#2A2A2A] active:scale-[0.98] transition-transform"
              >
                <div className="w-full aspect-[4/3] relative bg-[#1E1E1E]">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Coffee size={40} className="text-[#38BDF8]" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-[15px] font-semibold text-[#F5F5F0] text-center">
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

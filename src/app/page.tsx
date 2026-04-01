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

export const revalidate = 60;

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-black pb-24">
      {/* Header - Exact Match */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-baseline">
              <span className="text-[32px] font-black text-[#D4AF37] tracking-[4px]">SIDA</span>
              <span className="text-[24px] font-light text-white italic tracking-[1px] ml-1">Caffè</span>
            </div>
            <div className="flex items-center gap-2 mt-1 mb-2 max-w-[200px]">
              <div className="flex-1 h-[2px] bg-[#D4AF37]"></div>
              <Coffee size={16} className="text-[#D4AF37]" />
              <div className="flex-1 h-[2px] bg-[#D4AF37]"></div>
            </div>
            <p className="text-[13px] text-[#888888] tracking-[4px] uppercase">Consegna a domicilio</p>
          </div>
          <Link 
            href="/admin" 
            className="p-3 rounded-full bg-[#1A1A1A] border border-[#333333]"
          >
            <Settings size={22} className="text-[#888888]" />
          </Link>
        </div>
      </header>

      {/* Categories Grid */}
      <section className="px-3 mt-4">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-10">
            <Coffee size={64} className="text-[#333333] mb-4" />
            <h2 className="text-[20px] font-semibold text-white mb-2">Nessuna categoria</h2>
            <p className="text-[14px] text-[#888888] text-center">I prodotti saranno disponibili a breve</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="bg-[#111111] rounded-xl overflow-hidden border border-[#222222] active:scale-[0.98] transition-transform"
              >
                <div className="w-full aspect-[4/3] relative bg-[#1A1A1A]">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Coffee size={40} className="text-[#D4AF37]" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <h4 className="text-[15px] font-bold text-black text-center">
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

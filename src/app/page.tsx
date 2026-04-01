import { supabase, Category } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Coffee } from 'lucide-react';
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
    <main className="min-h-screen bg-[#050505] pb-24">
      {/* Artistic Header - Same as Original */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-baseline">
              <span className="text-[34px] font-black text-[#38BDF8] tracking-[6px]">SIDA</span>
              <span className="text-[26px] font-light text-[#F5F5F0] italic tracking-[2px]"> Caffè</span>
            </div>
            <div className="flex items-center gap-2 mt-1 mb-1">
              <div className="flex-1 h-[1px] bg-[#38BDF8] opacity-40"></div>
              <Coffee size={14} className="text-[#38BDF8]" />
              <div className="flex-1 h-[1px] bg-[#38BDF8] opacity-40"></div>
            </div>
            <p className="text-[12px] text-[#A3A3A3] tracking-[3px] uppercase">Consegna a domicilio</p>
          </div>
          <Link 
            href="/admin" 
            className="p-2.5 rounded-full bg-[#121212] mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Categories Grid */}
      <section className="px-3">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-10">
            <Coffee size={64} className="text-[#2A2A2A] mb-4" />
            <h2 className="text-[20px] font-semibold text-[#F5F5F0] mb-2">Nessuna categoria</h2>
            <p className="text-[14px] text-[#A3A3A3] text-center">I prodotti saranno disponibili a breve</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="bg-[#121212] rounded-2xl overflow-hidden border border-[#2A2A2A] active:scale-[0.98] transition-transform"
              >
                <div className="w-full h-[120px] relative bg-[#1E1E1E]">
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

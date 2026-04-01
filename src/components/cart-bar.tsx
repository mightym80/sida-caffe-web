"use client";

import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

export function CartBar() {
  const { totalItems } = useCart();

  if (totalItems === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-20 left-4 right-4 flex items-center justify-between bg-[#D4AF37] py-3.5 px-5 rounded-2xl z-40"
      style={{ boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)' }}
    >
      <div className="flex items-center">
        <ShoppingCart size={22} className="text-black" />
        <div className="ml-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-[12px] font-extrabold text-white">{totalItems}</span>
        </div>
      </div>
      <span className="text-[16px] font-bold text-black">Vedi Carrello</span>
      <ArrowRight size={20} className="text-black" />
    </Link>
  );
}

"use client";

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

export function CartButton() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative p-2 rounded-full bg-surface hover:bg-surface-highlight transition-colors"
    >
      <ShoppingCart size={20} className="text-text-primary" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}

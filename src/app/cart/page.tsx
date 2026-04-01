"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Coffee } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { BottomNav } from '@/components/bottom-nav';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full bg-surface hover:bg-surface-highlight transition-colors">
              <ArrowLeft size={20} className="text-text-primary" />
            </Link>
            <h1 className="text-lg font-bold text-text-primary">Carrello</h1>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <ShoppingBag size={64} className="text-text-secondary mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Carrello vuoto</h2>
          <p className="text-text-secondary mb-6">Aggiungi prodotti per iniziare</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Sfoglia Prodotti
          </Link>
        </div>

        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-40">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full bg-surface hover:bg-surface-highlight transition-colors">
              <ArrowLeft size={20} className="text-text-primary" />
            </Link>
            <h1 className="text-lg font-bold text-text-primary">Carrello ({totalItems})</h1>
          </div>
          <button
            onClick={clearCart}
            className="p-2 rounded-full bg-surface hover:bg-error/20 transition-colors"
          >
            <Trash2 size={18} className="text-error" />
          </button>
        </div>
      </header>

      <section className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-surface rounded-xl overflow-hidden border border-border flex">
            <div className="w-20 h-20 flex-shrink-0 relative bg-surface-highlight">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Coffee size={28} className="text-primary/50" />
                </div>
              )}
            </div>
            <div className="flex-1 p-3 flex flex-col justify-between">
              <h3 className="font-semibold text-text-primary text-sm">{item.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 bg-surface-highlight rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded bg-surface hover:bg-error/20 transition-colors"
                  >
                    <Minus size={14} className="text-text-primary" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-text-primary">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded bg-surface hover:bg-primary/20 transition-colors"
                  >
                    <Plus size={14} className="text-text-primary" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 rounded-lg hover:bg-error/20 transition-colors"
                >
                  <Trash2 size={16} className="text-error" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Fixed bottom checkout */}
      <div className="fixed bottom-16 left-0 right-0 bg-surface border-t border-border p-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-secondary">Totale prodotti</span>
            <span className="text-xl font-bold text-text-primary">{totalItems}</span>
          </div>
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors"
          >
            Procedi all'Ordine
          </Link>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

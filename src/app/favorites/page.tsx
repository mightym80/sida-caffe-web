"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Coffee, Trash2 } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';
import { CartButton } from '@/components/cart-button';

interface Favorite {
  id: string;
  name: string;
  image: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sida-favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
    setLoading(false);
  }, []);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('sida-favorites', JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart size={24} className="text-primary" />
            <h1 className="text-lg font-bold text-text-primary">Preferiti</h1>
          </div>
          <CartButton />
        </div>
      </header>

      <section className="max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Caricamento...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="text-text-secondary mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-text-primary mb-2">Nessun preferito</h2>
            <p className="text-text-secondary mb-6">Aggiungi prodotti ai preferiti per trovarli qui</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Sfoglia Prodotti
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((item) => (
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
                <div className="flex-1 p-3 flex items-center justify-between">
                  <h3 className="font-semibold text-text-primary text-sm">{item.name}</h3>
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="p-2 rounded-lg hover:bg-error/20 transition-colors"
                  >
                    <Trash2 size={18} className="text-error" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}

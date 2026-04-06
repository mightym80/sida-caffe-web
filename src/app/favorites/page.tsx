"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BottomNav } from '@/components/bottom-nav';
import { CartBar } from '@/components/cart-bar';
import { useCart } from '@/lib/cart-context';
import { toast } from '@/components/toaster';

const FAVORITES_KEY = 'sida-favorites';

interface Favorite {
  id: string;
  name: string;
  image: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, items, updateQuantity, removeItem: removeFromCart } = useCart();

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
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
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    toast('Rimosso dai preferiti', 'success');
  };

  const getQuantity = (id: string) => {
    const cartItem = items.find(i => i.id === id);
    return cartItem?.quantity || 0;
  };

  const handleAdd = (item: Favorite) => {
    addItem({ id: item.id, name: item.name, image: item.image });
    toast(`${item.name} aggiunto al carrello`, 'success');
  };

  const handleIncrease = (id: string) => {
    updateQuantity(id, getQuantity(id) + 1);
  };

  const handleDecrease = (id: string) => {
    const qty = getQuantity(id);
    if (qty > 1) {
      updateQuantity(id, qty - 1);
    } else {
      removeFromCart(id);
    }
  };

  return (
    <main className="mobile-container pb-safe" style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ padding: '20px 20px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#38BDF8" stroke="#38BDF8" strokeWidth="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#F5F5F0' }}>Preferiti</h1>
        </div>
      </header>

      {/* Content */}
      <section style={{ padding: '0 16px', paddingBottom: '100px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div className="shimmer" style={{ width: '100%', height: '96px', borderRadius: '12px', marginBottom: '12px' }} />
            <div className="shimmer" style={{ width: '100%', height: '96px', borderRadius: '12px' }} />
          </div>
        ) : favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2A2A2A" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#F5F5F0', marginBottom: '8px' }}>Nessun preferito</h2>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>Aggiungi prodotti ai preferiti per trovarli qui</p>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#38BDF8',
                color: '#0A0A0A',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'none',
              }}
            >
              Sfoglia Prodotti
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {favorites.map((item) => {
              const quantity = getQuantity(item.id);
              
              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#121212',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #2A2A2A',
                    display: 'flex',
                  }}
                >
                  <div style={{ width: '96px', height: '96px', flexShrink: 0, position: 'relative', backgroundColor: '#1E1E1E' }}>
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" style={{ opacity: 0.5 }}>
                          <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
                          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontWeight: 600, color: '#F5F5F0', fontSize: '14px', flex: 1, margin: 0 }}>{item.name}</h3>
                      <button
                        onClick={() => removeFavorite(item.id)}
                        style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '8px' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>

                    {/* Cart Controls */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                      {quantity === 0 ? (
                        <button
                          onClick={() => handleAdd(item)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 14px',
                            backgroundColor: '#38BDF8',
                            color: '#0A0A0A',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                          Aggiungi
                        </button>
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          backgroundColor: '#1E1E1E',
                          borderRadius: '8px',
                          padding: '4px',
                        }}>
                          <button
                            onClick={() => handleDecrease(item.id)}
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              backgroundColor: '#121212',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
                              <path d="M5 12h14"/>
                            </svg>
                          </button>
                          <span style={{ width: '28px', textAlign: 'center', fontSize: '16px', fontWeight: 700, color: '#F5F5F0' }}>{quantity}</span>
                          <button
                            onClick={() => handleIncrease(item.id)}
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              backgroundColor: '#121212',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
                              <path d="M12 5v14M5 12h14"/>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <CartBar />
      <BottomNav />
    </main>
  );
}

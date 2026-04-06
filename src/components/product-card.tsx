"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { toast } from '@/components/toaster';

const FAVORITES_KEY = 'sida-favorites';

interface Product {
  id: string;
  category_id: string;
  name: string;
  image: string;
  description: string;
  display_order: number;
  active: boolean;
}

interface Favorite {
  id: string;
  name: string;
  image: string;
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const [showZoom, setShowZoom] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const cartItem = items.find(i => i.id === product.id);
  const quantity = cartItem?.quantity || 0;

  // Check if product is in favorites on mount
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        const favorites: Favorite[] = JSON.parse(saved);
        setIsFavorite(favorites.some(f => f.id === product.id));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
  }, [product.id]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    let favorites: Favorite[] = [];
    
    if (saved) {
      try {
        favorites = JSON.parse(saved);
      } catch (e) {
        favorites = [];
      }
    }

    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter(f => f.id !== product.id);
      toast('Rimosso dai preferiti', 'success');
    } else {
      // Add to favorites
      favorites.push({
        id: product.id,
        name: product.name,
        image: product.image,
      });
      toast('Aggiunto ai preferiti', 'success');
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, image: product.image });
    toast(`${product.name} aggiunto al carrello`, 'success');
  };

  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  return (
    <>
      <div style={{
        backgroundColor: '#121212',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #2A2A2A',
        display: 'flex',
      }}>
        {/* Image */}
        <div 
          style={{
            width: '96px',
            height: '96px',
            flexShrink: 0,
            position: 'relative',
            backgroundColor: '#1E1E1E',
            cursor: product.image ? 'pointer' : 'default',
          }}
          onClick={() => product.image && setShowZoom(true)}
        >
          {product.image ? (
            <>
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                padding: '4px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '4px',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>
                </svg>
              </div>
            </>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" style={{ opacity: 0.5 }}>
                <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 600, color: '#F5F5F0', fontSize: '14px', margin: 0 }}>{product.name}</h3>
              {product.description && (
                <p style={{ fontSize: '11px', color: '#A3A3A3', marginTop: '2px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                  {product.description}
                </p>
              )}
            </div>
            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              style={{
                padding: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                marginLeft: '4px',
              }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill={isFavorite ? '#38BDF8' : 'none'} 
                stroke={isFavorite ? '#38BDF8' : '#666'} 
                strokeWidth="2"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            {quantity === 0 ? (
              <button
                onClick={handleAdd}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  backgroundColor: '#38BDF8',
                  color: '#0A0A0A',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
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
                gap: '8px',
                backgroundColor: '#1E1E1E',
                borderRadius: '8px',
                padding: '4px',
              }}>
                <button
                  onClick={handleDecrease}
                  style={{
                    padding: '4px',
                    borderRadius: '4px',
                    backgroundColor: '#121212',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
                    <path d="M5 12h14"/>
                  </svg>
                </button>
                <span style={{ width: '24px', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#F5F5F0' }}>{quantity}</span>
                <button
                  onClick={handleIncrease}
                  style={{
                    padding: '4px',
                    borderRadius: '4px',
                    backgroundColor: '#121212',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {showZoom && product.image && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowZoom(false)}
        >
          <button style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '8px',
            backgroundColor: '#121212',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
          />
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BottomNav } from '@/components/bottom-nav';
import { CartBar } from '@/components/cart-bar';
import { useCart } from '@/lib/cart-context';
import { toast } from '@/components/toaster';

const SUPABASE_URL = 'https://wyvcwibhcayassfqgofh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7rHj-FAXCRRI93wBhJSwfg_Zq2k568V';
const FAVORITES_KEY = 'sida-favorites';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  category_id: string;
  name: string;
  image: string;
  description: string;
}

interface Favorite {
  id: string;
  name: string;
  image: string;
}

export default function CategoryPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const { addItem, items, updateQuantity, removeItem } = useCart();

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        const favs: Favorite[] = JSON.parse(saved);
        setFavorites(favs.map(f => f.id));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        // Load category
        const catRes = await fetch(
          `${SUPABASE_URL}/rest/v1/categories?id=eq.${id}&select=id,name`,
          { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
        );
        const catData = await catRes.json();
        setCategory(catData?.[0] || null);

        // Load products
        const prodRes = await fetch(
          `${SUPABASE_URL}/rest/v1/products?category_id=eq.${id}&active=eq.true&order=display_order.asc&select=id,category_id,name,description,image`,
          { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
        );
        const prodData = await prodRes.json();
        setProducts(prodData || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) loadData();
  }, [id]);

  const getQuantity = (productId: string) => {
    const item = items.find(i => i.id === productId);
    return item?.quantity || 0;
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const toggleFavorite = (product: Product) => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    let favs: Favorite[] = saved ? JSON.parse(saved) : [];
    
    if (isFavorite(product.id)) {
      favs = favs.filter(f => f.id !== product.id);
      setFavorites(favorites.filter(f => f !== product.id));
      toast('Rimosso dai preferiti', 'success');
    } else {
      favs.push({ id: product.id, name: product.name, image: product.image });
      setFavorites([...favorites, product.id]);
      toast('Aggiunto ai preferiti', 'success');
    }
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  };

  const handleAdd = (product: Product) => {
    addItem({ id: product.id, name: product.name, image: product.image });
    toast(`${product.name} aggiunto`, 'success');
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #38BDF8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  if (!category) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#A3A3A3' }}>Categoria non trovata</p>
      </main>
    );
  }

  return (
    <main className="mobile-container pb-safe" style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 40, 
        backgroundColor: 'rgba(5, 5, 5, 0.95)', 
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #2A2A2A',
        padding: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '480px', margin: '0 auto' }}>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              backgroundColor: '#121212',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#F5F5F0', margin: 0 }}>{category.name}</h1>
            <p style={{ fontSize: '12px', color: '#A3A3A3', margin: '2px 0 0 0' }}>{products.length} prodotti</p>
          </div>
        </div>
      </header>

      {/* Products */}
      <section style={{ padding: '16px', maxWidth: '480px', margin: '0 auto', paddingBottom: '120px' }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ color: '#A3A3A3', fontSize: '15px' }}>Nessun prodotto disponibile</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.map((product) => {
              const quantity = getQuantity(product.id);
              const isFav = isFavorite(product.id);
              
              return (
                <div key={product.id} style={{
                  backgroundColor: '#121212',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #2A2A2A',
                  display: 'flex',
                }}>
                  {/* Image - clickable for zoom */}
                  <div 
                    onClick={() => product.image && setZoomImage(product.image)}
                    style={{ 
                      width: '90px', 
                      height: '90px', 
                      flexShrink: 0, 
                      position: 'relative', 
                      backgroundColor: '#1E1E1E',
                      cursor: product.image ? 'pointer' : 'default',
                    }}
                  >
                    {product.image ? (
                      <>
                        <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute',
                          bottom: '4px',
                          right: '4px',
                          padding: '4px',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          borderRadius: '4px',
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>
                          </svg>
                        </div>
                      </>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" style={{ opacity: 0.5 }}>
                          <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
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
                          <p style={{ fontSize: '11px', color: '#A3A3A3', marginTop: '2px', margin: 0 }}>{product.description}</p>
                        )}
                      </div>
                      {/* Favorite button */}
                      <button
                        onClick={() => toggleFavorite(product)}
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
                          fill={isFav ? '#38BDF8' : 'none'} 
                          stroke={isFav ? '#38BDF8' : '#666'} 
                          strokeWidth="2"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                      </button>
                    </div>

                    {/* Cart Controls */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                      {quantity === 0 ? (
                        <button
                          onClick={() => handleAdd(product)}
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
                            onClick={() => quantity > 1 ? updateQuantity(product.id, quantity - 1) : removeItem(product.id)}
                            style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#121212', border: 'none', cursor: 'pointer' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
                              <path d="M5 12h14"/>
                            </svg>
                          </button>
                          <span style={{ width: '24px', textAlign: 'center', fontSize: '15px', fontWeight: 700, color: '#F5F5F0' }}>{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#121212', border: 'none', cursor: 'pointer' }}
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
              );
            })}
          </div>
        )}
      </section>

      <CartBar />
      <BottomNav />

      {/* Zoom Modal */}
      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <button 
            onClick={() => setZoomImage(null)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              padding: '12px',
              backgroundColor: '#121212',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              zIndex: 101,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
          <Image
            src={zoomImage}
            alt="Zoom"
            width={400}
            height={400}
            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
          />
        </div>
      )}
    </main>
  );
}

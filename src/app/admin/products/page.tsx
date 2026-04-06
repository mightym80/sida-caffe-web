"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const ADMIN_PASSWORD = 'sida2026';
const SUPABASE_URL = 'https://wyvcwibhcayassfqgofh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7rHj-FAXCRRI93wBhJSwfg_Zq2k568V';

async function supabaseFetch(table: string, method: string, body?: any, id?: string) {
  try {
    const url = id 
      ? `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`
      : `${SUPABASE_URL}/rest/v1/${table}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Errore: ${response.status}`);
    }
    
    if (method === 'DELETE' || method === 'PATCH') return null;
    return response.json();
  } catch (err: any) {
    console.error('Supabase fetch error:', err);
    throw err;
  }
}

async function getCategories() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=*&order=display_order.asc`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    if (!response.ok) {
      console.error('Categories fetch error:', response.status);
      return [];
    }
    const data = await response.json();
    console.log('Categories loaded:', data.length);
    return data;
  } catch (err) {
    console.error('Error loading categories:', err);
    return [];
  }
}

async function getProducts() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=display_order.asc`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    if (!response.ok) {
      console.error('Products fetch error:', response.status);
      return [];
    }
    const data = await response.json();
    console.log('Products loaded:', data.length);
    return data;
  } catch (err) {
    console.error('Error loading products:', err);
    return [];
  }
}

interface Category {
  id: string;
  name: string;
  image: string;
  display_order: number;
  active: boolean;
}

interface Product {
  id: string;
  category_id: string;
  name: string;
  image: string;
  description: string;
  display_order: number;
  active: boolean;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'categories' | 'products'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sida-admin-pwd');
    if (saved !== ADMIN_PASSWORD) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats || []);
      setProducts(prods || []);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const openAddModal = () => {
    setEditItem(null);
    setFormName('');
    setFormDesc('');
    setFormImage('');
    setFormCategoryId(selectedCategory || (categories.length > 0 ? categories[0].id : ''));
    setError('');
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditItem(item);
    setFormName(item.name);
    setFormDesc(item.description || '');
    setFormImage(item.image || '');
    setFormCategoryId(item.category_id || '');
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setError('Inserisci un nome');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      if (tab === 'categories') {
        const data = {
          name: formName,
          image: formImage,
          display_order: editItem ? editItem.display_order : categories.length,
          active: true
        };
        
        if (editItem) {
          await supabaseFetch('categories', 'PATCH', { name: formName, image: formImage }, editItem.id);
        } else {
          await supabaseFetch('categories', 'POST', data);
        }
      } else {
        if (!formCategoryId) {
          setError('Seleziona una categoria');
          setSaving(false);
          return;
        }
        
        const data = {
          name: formName,
          description: formDesc,
          image: formImage,
          category_id: formCategoryId,
          display_order: editItem ? editItem.display_order : products.filter(p => p.category_id === formCategoryId).length,
          active: true
        };
        
        if (editItem) {
          await supabaseFetch('products', 'PATCH', { name: formName, description: formDesc, image: formImage, category_id: formCategoryId }, editItem.id);
        } else {
          await supabaseFetch('products', 'POST', data);
        }
      }
      
      setShowModal(false);
      loadData();
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Errore di salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Eliminare "${item.name}"?`)) return;
    
    try {
      const table = tab === 'categories' ? 'categories' : 'products';
      await supabaseFetch(table, 'DELETE', null, item.id);
      loadData();
    } catch (err) {
      alert('Errore eliminazione');
    }
  };

  const getCategoryName = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : '';
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Compress image before upload
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > MAX_SIZE) {
          height = (height * MAX_SIZE) / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width = (width * MAX_SIZE) / height;
          height = MAX_SIZE;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        setFormImage(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #38BDF8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#050505' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
        <Link 
          href="/admin/dashboard" 
          style={{ width: '44px', height: '44px', borderRadius: '22px', backgroundColor: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
            <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
          </svg>
        </Link>
        <h1 style={{ flex: 1, fontSize: '20px', fontWeight: 700, color: '#F5F5F0', margin: 0 }}>Gestione Prodotti</h1>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 16px', marginBottom: '12px' }}>
        <button
          onClick={() => { setTab('categories'); setSelectedCategory(''); }}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid', borderColor: tab === 'categories' ? '#38BDF8' : '#2A2A2A', backgroundColor: tab === 'categories' ? '#38BDF8' : '#121212', color: tab === 'categories' ? '#0A0A0A' : '#A3A3A3', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
        >
          Categorie ({categories.length})
        </button>
        <button
          onClick={() => setTab('products')}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid', borderColor: tab === 'products' ? '#38BDF8' : '#2A2A2A', backgroundColor: tab === 'products' ? '#38BDF8' : '#121212', color: tab === 'products' ? '#0A0A0A' : '#A3A3A3', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
        >
          Prodotti ({products.length})
        </button>
      </div>

      {/* Category Filter */}
      {tab === 'products' && categories.length > 0 && (
        <div style={{ padding: '0 16px', marginBottom: '12px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSelectedCategory('')}
              style={{ padding: '8px 14px', borderRadius: '16px', border: '1px solid', borderColor: !selectedCategory ? '#38BDF8' : '#2A2A2A', backgroundColor: !selectedCategory ? '#38BDF8' : '#121212', color: !selectedCategory ? '#0A0A0A' : '#A3A3A3', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Tutti
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ padding: '8px 14px', borderRadius: '16px', border: '1px solid', borderColor: selectedCategory === cat.id ? '#38BDF8' : '#2A2A2A', backgroundColor: selectedCategory === cat.id ? '#38BDF8' : '#121212', color: selectedCategory === cat.id ? '#0A0A0A' : '#A3A3A3', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ padding: '0 16px', paddingBottom: '100px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #38BDF8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div>
            {(tab === 'categories' ? categories : filteredProducts).length === 0 ? (
              <p style={{ textAlign: 'center', color: '#A3A3A3', padding: '40px 0', fontSize: '15px' }}>
                {tab === 'categories' ? 'Nessuna categoria' : 'Nessun prodotto'}
              </p>
            ) : (
              (tab === 'categories' ? categories : filteredProducts).map((item) => (
                <div 
                  key={item.id} 
                  style={{ display: 'flex', alignItems: 'center', backgroundColor: '#121212', borderRadius: '12px', padding: '12px', marginBottom: '8px', border: '1px solid #2A2A2A' }}
                >
                  {/* Image */}
                  <div style={{ width: '52px', height: '52px', borderRadius: '8px', backgroundColor: '#1E1E1E', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2">
                          <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, marginLeft: '12px' }}>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#F5F5F0', margin: 0 }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: '#A3A3A3', margin: '2px 0 0 0' }}>
                      {tab === 'categories' ? 'Attiva' : getCategoryName((item as Product).category_id)}
                    </p>
                  </div>

                  {/* Actions */}
                  <button onClick={() => openEditModal(item)} style={{ padding: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(item)} style={{ padding: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={openAddModal}
        style={{ position: 'fixed', bottom: '24px', right: '20px', width: '56px', height: '56px', borderRadius: '28px', backgroundColor: '#38BDF8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ backgroundColor: '#121212', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', width: '100%', maxHeight: '85vh', overflow: 'auto', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ padding: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#F5F5F0', margin: '0 0 20px 0' }}>
                {editItem ? 'Modifica' : 'Nuovo'} {tab === 'categories' ? 'Categoria' : 'Prodotto'}
              </h2>

              {error && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                  <p style={{ color: '#EF4444', fontSize: '14px', margin: 0 }}>{error}</p>
                </div>
              )}

              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Nome *</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nome"
                style={{ width: '100%', backgroundColor: '#050505', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '14px', fontSize: '15px', color: '#F5F5F0', marginBottom: '16px', boxSizing: 'border-box' }}
              />

              {tab === 'products' && (
                <>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Descrizione</label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Descrizione"
                    style={{ width: '100%', backgroundColor: '#050505', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '14px', fontSize: '15px', color: '#F5F5F0', marginBottom: '16px', minHeight: '80px', resize: 'none', boxSizing: 'border-box' }}
                  />

                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Categoria *</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormCategoryId(cat.id)}
                        style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid', borderColor: formCategoryId === cat.id ? '#38BDF8' : '#2A2A2A', backgroundColor: formCategoryId === cat.id ? '#38BDF8' : '#1E1E1E', color: formCategoryId === cat.id ? '#0A0A0A' : '#A3A3A3', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Immagine</label>
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px dashed #2A2A2A', backgroundColor: '#050505', cursor: 'pointer', padding: 0 }}
              >
                {formImage ? (
                  <div style={{ position: 'relative', width: '100%', height: '160px' }}>
                    <Image src={formImage} alt="Preview" fill style={{ objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <span style={{ fontSize: '13px', color: '#A3A3A3', marginTop: '8px' }}>Seleziona immagine</span>
                  </div>
                )}
              </button>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '14px', borderRadius: '10px', backgroundColor: '#1E1E1E', border: 'none', color: '#A3A3A3', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  style={{ flex: 1, padding: '14px', borderRadius: '10px', backgroundColor: '#38BDF8', border: 'none', color: '#0A0A0A', fontSize: '15px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
                >
                  {saving ? 'Salvataggio...' : 'Salva'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </main>
  );
}

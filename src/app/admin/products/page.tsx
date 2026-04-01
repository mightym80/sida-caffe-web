"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Pencil, Trash2, Coffee, Folder, ChevronUp, ChevronDown, Loader2, X } from 'lucide-react';
import { supabase, Category, Product } from '@/lib/supabase';
import { toast } from '@/components/toaster';

const ADMIN_PASSWORD = 'sida2026';

export default function AdminProductsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'categories' | 'products'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sida-admin-pwd');
    if (saved !== ADMIN_PASSWORD) {
      router.push('/admin');
    }
  }, [router]);

  const loadData = useCallback(async () => {
    try {
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      setCategories(cats || []);

      let query = supabase.from('products').select('*').order('display_order', { ascending: true });
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }
      const { data: prods } = await query;
      setProducts(prods || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddModal = () => {
    setEditItem(null);
    setFormName('');
    setFormDesc('');
    setFormImage('');
    setFormCategoryId(selectedCategory || (categories.length > 0 ? categories[0].id : ''));
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditItem(item);
    setFormName(item.name);
    setFormDesc(item.description || '');
    setFormImage(item.image || '');
    setFormCategoryId(item.category_id || '');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast('Inserisci un nome', 'error');
      return;
    }

    setSaving(true);
    try {
      if (tab === 'categories') {
        if (editItem) {
          await supabase.from('categories').update({ name: formName, image: formImage }).eq('id', editItem.id);
        } else {
          await supabase.from('categories').insert({ name: formName, image: formImage, display_order: categories.length });
        }
      } else {
        if (!formCategoryId) {
          toast('Seleziona una categoria', 'error');
          setSaving(false);
          return;
        }
        if (editItem) {
          await supabase.from('products').update({ 
            name: formName, 
            description: formDesc, 
            image: formImage, 
            category_id: formCategoryId 
          }).eq('id', editItem.id);
        } else {
          const maxOrder = products.filter(p => p.category_id === formCategoryId).length;
          await supabase.from('products').insert({ 
            name: formName, 
            description: formDesc, 
            image: formImage, 
            category_id: formCategoryId,
            display_order: maxOrder
          });
        }
      }
      setShowModal(false);
      loadData();
      toast('Salvato con successo', 'success');
    } catch (error) {
      toast('Errore durante il salvataggio', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Eliminare "${item.name}"?`)) return;
    try {
      if (tab === 'categories') {
        await supabase.from('categories').delete().eq('id', item.id);
      } else {
        await supabase.from('products').delete().eq('id', item.id);
      }
      loadData();
      toast('Eliminato con successo', 'success');
    } catch (error) {
      toast('Errore durante l\'eliminazione', 'error');
    }
  };

  const handleMoveUp = async (item: Product, index: number) => {
    const categoryProducts = products.filter(p => p.category_id === item.category_id);
    const currentIndex = categoryProducts.findIndex(p => p.id === item.id);
    if (currentIndex <= 0) return;

    const prevItem = categoryProducts[currentIndex - 1];
    await Promise.all([
      supabase.from('products').update({ display_order: currentIndex - 1 }).eq('id', item.id),
      supabase.from('products').update({ display_order: currentIndex }).eq('id', prevItem.id),
    ]);
    loadData();
  };

  const handleMoveDown = async (item: Product, index: number) => {
    const categoryProducts = products.filter(p => p.category_id === item.category_id);
    const currentIndex = categoryProducts.findIndex(p => p.id === item.id);
    if (currentIndex >= categoryProducts.length - 1) return;

    const nextItem = categoryProducts[currentIndex + 1];
    await Promise.all([
      supabase.from('products').update({ display_order: currentIndex + 1 }).eq('id', item.id),
      supabase.from('products').update({ display_order: currentIndex }).eq('id', nextItem.id),
    ]);
    loadData();
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard" className="p-2 rounded-full bg-surface hover:bg-surface-highlight transition-colors">
            <ArrowLeft size={20} className="text-text-primary" />
          </Link>
          <h1 className="text-lg font-bold text-text-primary">Gestione Prodotti</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 py-4 flex gap-2">
        <button
          onClick={() => { setTab('categories'); setSelectedCategory(''); }}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
            tab === 'categories' ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary'
          }`}
        >
          Categorie ({categories.length})
        </button>
        <button
          onClick={() => setTab('products')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
            tab === 'products' ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary'
          }`}
        >
          Prodotti ({products.length})
        </button>
      </div>

      {/* Category Filter for Products */}
      {tab === 'products' && categories.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => { setSelectedCategory(''); setLoading(true); }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary'
              }`}
            >
              Tutti
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setLoading(true); }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <section className="max-w-2xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 size={32} className="text-primary mx-auto animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {(tab === 'categories' ? categories : filteredProducts).map((item, index) => (
              <div key={item.id} className="bg-surface rounded-xl border border-border p-3 flex items-center gap-3">
                {tab === 'products' && (
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleMoveUp(item as Product, index)}
                      className="p-1 hover:bg-surface-highlight rounded transition-colors"
                    >
                      <ChevronUp size={16} className="text-text-secondary" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(item as Product, index)}
                      className="p-1 hover:bg-surface-highlight rounded transition-colors"
                    >
                      <ChevronDown size={16} className="text-text-secondary" />
                    </button>
                  </div>
                )}

                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-surface-highlight overflow-hidden relative">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {tab === 'categories' ? (
                        <Folder size={20} className="text-primary/50" />
                      ) : (
                        <Coffee size={20} className="text-primary/50" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary text-sm truncate">{item.name}</h3>
                  {tab === 'products' && (
                    <p className="text-xs text-text-secondary">{getCategoryName((item as Product).category_id)}</p>
                  )}
                </div>

                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Pencil size={16} className="text-primary" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 rounded-lg hover:bg-error/20 transition-colors"
                >
                  <Trash2 size={16} className="text-error" />
                </button>
              </div>
            ))}

            {(tab === 'categories' ? categories : filteredProducts).length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary">
                  {tab === 'categories' ? 'Nessuna categoria' : 'Nessun prodotto'}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* FAB */}
      <button
        onClick={openAddModal}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
      >
        <Plus size={24} />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
          <div className="bg-surface rounded-t-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">
                {editItem ? 'Modifica' : 'Nuovo'} {tab === 'categories' ? 'Categoria' : 'Prodotto'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-surface-highlight">
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Nome *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
                  placeholder="Nome"
                />
              </div>

              {tab === 'products' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Descrizione</label>
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none min-h-[80px]"
                      placeholder="Descrizione"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Categoria *</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setFormCategoryId(cat.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            formCategoryId === cat.id ? 'bg-primary text-primary-foreground' : 'bg-surface-highlight text-text-secondary'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Immagine</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary"
                />
                {formImage && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden">
                    <Image src={formImage} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-surface-highlight text-text-secondary rounded-xl font-medium"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-50"
                >
                  {saving ? 'Salvataggio...' : 'Salva'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

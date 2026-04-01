"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Pencil, Trash2, Coffee, Folder, ChevronUp, ChevronDown, Loader2, X, Camera } from 'lucide-react';
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
      const { data: cats, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (catsError) {
        console.error('Categories error:', catsError);
      }
      setCategories(cats || []);

      let query = supabase.from('products').select('*').order('display_order', { ascending: true });
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }
      const { data: prods, error: prodsError } = await query;
      
      if (prodsError) {
        console.error('Products error:', prodsError);
      }
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
          const { error } = await supabase.from('categories').update({ name: formName, image: formImage }).eq('id', editItem.id);
          if (error) {
            console.error('Update error:', error);
            throw error;
          }
        } else {
          const { error } = await supabase.from('categories').insert({ 
            name: formName, 
            image: formImage, 
            display_order: categories.length, 
            active: true 
          });
          if (error) {
            console.error('Insert error:', error);
            throw error;
          }
        }
      } else {
        if (!formCategoryId) {
          toast('Seleziona una categoria', 'error');
          setSaving(false);
          return;
        }
        if (editItem) {
          const { error } = await supabase.from('products').update({ 
            name: formName, 
            description: formDesc, 
            image: formImage, 
            category_id: formCategoryId 
          }).eq('id', editItem.id);
          if (error) {
            console.error('Update error:', error);
            throw error;
          }
        } else {
          const maxOrder = products.filter(p => p.category_id === formCategoryId).length;
          const { error } = await supabase.from('products').insert({ 
            name: formName, 
            description: formDesc, 
            image: formImage, 
            category_id: formCategoryId,
            display_order: maxOrder,
            active: true
          });
          if (error) {
            console.error('Insert error:', error);
            throw error;
          }
        }
      }
      setShowModal(false);
      loadData();
      toast('Salvato con successo', 'success');
    } catch (error: any) {
      console.error('Save error:', error);
      toast(`Errore: ${error?.message || 'Operazione fallita'}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Eliminare "${item.name}"?`)) return;
    try {
      if (tab === 'categories') {
        const { error } = await supabase.from('categories').delete().eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').delete().eq('id', item.id);
        if (error) throw error;
      }
      loadData();
      toast('Eliminato', 'success');
    } catch (error) {
      toast('Errore eliminazione', 'error');
    }
  };

  const handleMoveUp = async (item: Product) => {
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

  const handleMoveDown = async (item: Product) => {
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
    reader.onloadend = () => setFormImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3">
        <Link href="/admin/dashboard" className="p-2 rounded-full bg-[#121212]">
          <ArrowLeft size={24} className="text-[#F5F5F0]" />
        </Link>
        <h1 className="flex-1 text-[20px] font-bold text-[#F5F5F0]">Gestione Prodotti</h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-3">
        <button
          onClick={() => { setTab('categories'); setSelectedCategory(''); }}
          className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold border transition-colors ${
            tab === 'categories' 
              ? 'bg-[#38BDF8] border-[#38BDF8] text-[#0A0A0A]' 
              : 'bg-[#121212] border-[#2A2A2A] text-[#A3A3A3]'
          }`}
        >
          Categorie ({categories.length})
        </button>
        <button
          onClick={() => setTab('products')}
          className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold border transition-colors ${
            tab === 'products' 
              ? 'bg-[#38BDF8] border-[#38BDF8] text-[#0A0A0A]' 
              : 'bg-[#121212] border-[#2A2A2A] text-[#A3A3A3]'
          }`}
        >
          Prodotti ({products.length})
        </button>
      </div>

      {/* Category Filter */}
      {tab === 'products' && categories.length > 0 && (
        <div className="px-4 mb-3 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => { setSelectedCategory(''); setLoading(true); }}
              className={`px-3.5 py-2 rounded-full text-[12px] font-semibold border whitespace-nowrap ${
                !selectedCategory 
                  ? 'bg-[#38BDF8] border-[#38BDF8] text-[#0A0A0A]' 
                  : 'bg-[#121212] border-[#2A2A2A] text-[#A3A3A3]'
              }`}
            >
              Tutti
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setLoading(true); }}
                className={`px-3.5 py-2 rounded-full text-[12px] font-semibold border whitespace-nowrap ${
                  selectedCategory === cat.id 
                    ? 'bg-[#38BDF8] border-[#38BDF8] text-[#0A0A0A]' 
                    : 'bg-[#121212] border-[#2A2A2A] text-[#A3A3A3]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <div className="px-4 pb-24">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={32} className="text-[#38BDF8] animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {(tab === 'categories' ? categories : filteredProducts).length === 0 ? (
              <div className="text-center py-10">
                <p className="text-[15px] text-[#A3A3A3]">
                  {tab === 'categories' ? 'Nessuna categoria' : 'Nessun prodotto'}
                </p>
              </div>
            ) : (
              (tab === 'categories' ? categories : filteredProducts).map((item, index) => {
                const isProduct = tab === 'products';
                const categoryProducts = isProduct ? filteredProducts.filter(p => p.category_id === (item as Product).category_id) : [];
                const productIndex = isProduct ? categoryProducts.findIndex(p => p.id === item.id) : -1;
                const isFirst = productIndex === 0;
                const isLast = productIndex === categoryProducts.length - 1;

                return (
                  <div key={item.id} className="flex items-center bg-[#121212] rounded-xl p-3 border border-[#2A2A2A]">
                    {/* Move buttons for products */}
                    {isProduct && (
                      <div className="mr-2">
                        <button
                          onClick={() => handleMoveUp(item as Product)}
                          className={`p-1 ${isFirst ? 'opacity-30' : ''}`}
                          disabled={isFirst}
                        >
                          <ChevronUp size={18} className={isFirst ? 'text-[#2A2A2A]' : 'text-[#38BDF8]'} />
                        </button>
                        <button
                          onClick={() => handleMoveDown(item as Product)}
                          className={`p-1 ${isLast ? 'opacity-30' : ''}`}
                          disabled={isLast}
                        >
                          <ChevronDown size={18} className={isLast ? 'text-[#2A2A2A]' : 'text-[#38BDF8]'} />
                        </button>
                      </div>
                    )}

                    {/* Image */}
                    <div className="w-[52px] h-[52px] rounded-lg bg-[#1E1E1E] overflow-hidden flex-shrink-0 relative">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {tab === 'categories' ? (
                            <Folder size={24} className="text-[#38BDF8]" />
                          ) : (
                            <Coffee size={24} className="text-[#38BDF8]" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 ml-3">
                      <p className="text-[15px] font-semibold text-[#F5F5F0]">{item.name}</p>
                      <p className="text-[12px] text-[#A3A3A3] mt-0.5">
                        {tab === 'categories' 
                          ? ((item as Category).active ? 'Attiva' : 'Disattivata')
                          : getCategoryName((item as Product).category_id)
                        }
                      </p>
                    </div>

                    {/* Actions */}
                    <button onClick={() => openEditModal(item)} className="p-2.5">
                      <Pencil size={18} className="text-[#38BDF8]" />
                    </button>
                    <button onClick={() => handleDelete(item)} className="p-2.5">
                      <Trash2 size={18} className="text-[#EF4444]" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={openAddModal}
        className="fixed bottom-6 right-5 w-14 h-14 bg-[#38BDF8] rounded-full flex items-center justify-center shadow-lg"
      >
        <Plus size={28} className="text-[#0A0A0A]" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end">
          <div className="bg-[#121212] rounded-t-[20px] w-full max-h-[85vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-bold text-[#F5F5F0]">
                  {editItem ? 'Modifica' : 'Nuova'} {tab === 'categories' ? 'Categoria' : 'Prodotto'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2">
                  <X size={24} className="text-[#A3A3A3]" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#A3A3A3] uppercase tracking-wider mb-1.5">Nome *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#050505] border border-[#2A2A2A] rounded-xl px-4 py-3.5 text-[15px] text-[#F5F5F0] focus:border-[#38BDF8] focus:outline-none"
                    placeholder="Nome"
                  />
                </div>

                {tab === 'products' && (
                  <>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#A3A3A3] uppercase tracking-wider mb-1.5">Descrizione</label>
                      <textarea
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        className="w-full bg-[#050505] border border-[#2A2A2A] rounded-xl px-4 py-3.5 text-[15px] text-[#F5F5F0] focus:border-[#38BDF8] focus:outline-none min-h-[80px]"
                        placeholder="Descrizione"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#A3A3A3] uppercase tracking-wider mb-1.5">Categoria *</label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setFormCategoryId(cat.id)}
                            className={`px-4 py-2 rounded-full text-[13px] font-semibold border ${
                              formCategoryId === cat.id 
                                ? 'bg-[#38BDF8] border-[#38BDF8] text-[#0A0A0A]' 
                                : 'bg-[#1E1E1E] border-[#2A2A2A] text-[#A3A3A3]'
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
                  <label className="block text-[12px] font-semibold text-[#A3A3A3] uppercase tracking-wider mb-1.5">Immagine</label>
                  <label className="block border border-dashed border-[#2A2A2A] rounded-xl overflow-hidden cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {formImage ? (
                      <div className="relative w-full h-40">
                        <Image src={formImage} alt="Preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 bg-[#050505]">
                        <Camera size={32} className="text-[#A3A3A3]" />
                        <span className="text-[13px] text-[#A3A3A3] mt-2">Seleziona immagine</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3.5 rounded-xl bg-[#1E1E1E] text-[15px] font-semibold text-[#A3A3A3]"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3.5 rounded-xl bg-[#38BDF8] text-[15px] font-bold text-[#0A0A0A] disabled:opacity-60"
                  >
                    {saving ? 'Salvataggio...' : 'Salva'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

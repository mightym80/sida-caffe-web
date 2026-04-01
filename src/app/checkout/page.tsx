"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { toast } from '@/components/toaster';
import { BottomNav } from '@/components/bottom-nav';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, totalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    surname: '',
    address: '',
    phone: '',
    town: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.surname || !form.address || !form.phone || !form.town) {
      toast('Compila tutti i campi obbligatori', 'error');
      return;
    }

    if (items.length === 0) {
      toast('Il carrello è vuoto', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_surname: form.surname,
          customer_address: form.address,
          customer_phone: form.phone,
          customer_town: form.town,
          items: items.map(i => ({ product_name: i.name, quantity: i.quantity })),
          total_items: totalItems,
          order_type: 'order',
          notes: form.notes,
        }),
      });

      if (!res.ok) throw new Error('Errore invio ordine');

      clearCart();
      toast('Ordine inviato con successo!', 'success');
      router.push('/order-success');
    } catch (error) {
      toast('Errore durante l\'invio dell\'ordine', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/cart" className="p-2 rounded-full bg-surface hover:bg-surface-highlight transition-colors">
            <ArrowLeft size={20} className="text-text-primary" />
          </Link>
          <h1 className="text-lg font-bold text-text-primary">Completa Ordine</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="bg-surface rounded-xl border border-border p-4 mb-6">
          <h3 className="font-semibold text-text-primary mb-2">Riepilogo</h3>
          <p className="text-text-secondary text-sm">{totalItems} prodotti nel carrello</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Nome *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
            placeholder="Il tuo nome"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Cognome *</label>
          <input
            type="text"
            value={form.surname}
            onChange={(e) => setForm({ ...form, surname: e.target.value })}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
            placeholder="Il tuo cognome"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Città/Paese *</label>
          <input
            type="text"
            value={form.town}
            onChange={(e) => setForm({ ...form, town: e.target.value })}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
            placeholder="Es: Milano, Roma..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Indirizzo *</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
            placeholder="Via, numero civico"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Telefono *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
            placeholder="Il tuo numero di telefono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Note (opzionale)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none min-h-[100px]"
            placeholder="Note aggiuntive per la consegna..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <Send size={20} />
              Invia Ordine
            </>
          )}
        </button>

        <p className="text-center text-text-secondary text-sm">
          Pagamento alla consegna
        </p>
      </form>

      <BottomNav />
    </main>
  );
}

"use client";

import { useState } from 'react';
import { Wrench, Send, Loader2, Phone } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';
import { CartButton } from '@/components/cart-button';
import { toast } from '@/components/toaster';

export default function AssistancePage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    surname: '',
    phone: '',
    address: '',
    town: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.surname || !form.phone || !form.town) {
      toast('Compila tutti i campi obbligatori', 'error');
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
          items: [{ product_name: 'Richiesta Assistenza', quantity: 1 }],
          total_items: 1,
          order_type: 'assistance',
          notes: form.notes,
        }),
      });

      if (!res.ok) throw new Error('Errore invio richiesta');

      setSent(true);
      toast('Richiesta inviata con successo!', 'success');
    } catch (error) {
      toast('Errore durante l\'invio della richiesta', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wrench size={24} className="text-primary" />
              <h1 className="text-lg font-bold text-text-primary">Assistenza</h1>
            </div>
            <CartButton />
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone size={40} className="text-success" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Richiesta Inviata!</h2>
          <p className="text-text-secondary mb-6">Ti contatteremo al più presto per fissare un appuntamento.</p>
          <button
            onClick={() => setSent(false)}
            className="px-6 py-3 bg-surface border border-border rounded-xl font-semibold text-text-primary hover:bg-surface-highlight transition-colors"
          >
            Nuova Richiesta
          </button>
        </div>

        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench size={24} className="text-primary" />
            <h1 className="text-lg font-bold text-text-primary">Assistenza</h1>
          </div>
          <CartButton />
        </div>
      </header>

      <section className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl p-4 border border-primary/30 mb-6">
          <h2 className="font-bold text-text-primary mb-2">Hai bisogno di assistenza?</h2>
          <p className="text-text-secondary text-sm">
            Compila il modulo e ti contatteremo per fissare un appuntamento per la manutenzione della tua macchina.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Nome *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Cognome *</label>
            <input
              type="text"
              value={form.surname}
              onChange={(e) => setForm({ ...form, surname: e.target.value })}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Città/Paese *</label>
            <input
              type="text"
              value={form.town}
              onChange={(e) => setForm({ ...form, town: e.target.value })}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Indirizzo</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Telefono *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Descrizione problema</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none min-h-[100px]"
              placeholder="Descrivi il problema della tua macchina..."
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
                Richiedi Assistenza
              </>
            )}
          </button>
        </form>
      </section>

      <BottomNav />
    </main>
  );
}

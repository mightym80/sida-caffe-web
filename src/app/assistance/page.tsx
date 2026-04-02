"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BottomNav } from '@/components/bottom-nav';
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
      const { error } = await supabase.from('orders').insert({
        customer_name: form.name,
        customer_surname: form.surname,
        customer_address: form.address,
        customer_phone: form.phone,
        customer_town: form.town,
        items: [{ product_name: 'Richiesta Assistenza', quantity: 1 }],
        total_items: 1,
        order_type: 'assistance',
        notes: form.notes,
        status: 'pending',
      });

      if (error) throw error;

      setSent(true);
      toast('Richiesta inviata con successo!', 'success');
    } catch (error) {
      console.error('Error:', error);
      toast('Errore durante l\'invio della richiesta', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (sent) {
    return (
      <main className="mobile-container pb-safe" style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
        <header style={{ padding: '20px 20px 16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#F5F5F0' }}>Assistenza</h1>
          </div>
        </header>

        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '40px',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <path d="m9 11 3 3L22 4"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#F5F5F0', marginBottom: '8px' }}>Richiesta Inviata!</h2>
          <p style={{ color: '#A3A3A3', fontSize: '15px', marginBottom: '24px' }}>Ti contatteremo al più presto per fissare un appuntamento.</p>
          <button
            onClick={() => setSent(false)}
            style={{
              padding: '14px 28px',
              backgroundColor: '#121212',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              color: '#F5F5F0',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            Nuova Richiesta
          </button>
        </div>

        <BottomNav />
      </main>
    );
  }

  return (
    <main className="mobile-container pb-safe" style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ padding: '20px 20px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#F5F5F0' }}>Assistenza</h1>
        </div>
      </header>

      {/* Info Banner */}
      <section style={{ padding: '0 16px', marginBottom: '20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(125, 211, 252, 0.15) 0%, rgba(56, 189, 248, 0.1) 100%)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid rgba(125, 211, 252, 0.3)',
        }}>
          <h2 style={{ fontWeight: 700, color: '#F5F5F0', fontSize: '16px', marginBottom: '6px' }}>Hai bisogno di assistenza?</h2>
          <p style={{ color: '#A3A3A3', fontSize: '13px', lineHeight: 1.5 }}>
            Compila il modulo e ti contatteremo per fissare un appuntamento per la manutenzione della tua macchina.
          </p>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '0 16px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A3A3A3', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nome *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: '#121212',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#F5F5F0',
                fontSize: '15px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A3A3A3', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cognome *</label>
            <input
              type="text"
              value={form.surname}
              onChange={(e) => setForm({ ...form, surname: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: '#121212',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#F5F5F0',
                fontSize: '15px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A3A3A3', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Città/Paese *</label>
            <input
              type="text"
              value={form.town}
              onChange={(e) => setForm({ ...form, town: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: '#121212',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#F5F5F0',
                fontSize: '15px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A3A3A3', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Indirizzo</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: '#121212',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#F5F5F0',
                fontSize: '15px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A3A3A3', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Telefono *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: '#121212',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#F5F5F0',
                fontSize: '15px',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A3A3A3', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Descrizione problema</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Descrivi il problema della tua macchina..."
              style={{
                width: '100%',
                backgroundColor: '#121212',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#F5F5F0',
                fontSize: '15px',
                minHeight: '100px',
                resize: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px',
              backgroundColor: '#7DD3FC',
              borderRadius: '12px',
              border: 'none',
              color: '#0A0A0A',
              fontWeight: 700,
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <div style={{ width: '24px', height: '24px', border: '3px solid #0A0A0A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m22 2-7 20-4-9-9-4Z"/>
                  <path d="M22 2 11 13"/>
                </svg>
                Richiedi Assistenza
              </>
            )}
          </button>
        </form>
      </section>

      <BottomNav />
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

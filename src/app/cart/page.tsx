"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { BottomNav } from '@/components/bottom-nav';
import { toast } from '@/components/toaster';

const SUPABASE_URL = 'https://wyvcwibhcayassfqgofh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7rHj-FAXCRRI93wBhJSwfg_Zq2k568V';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, totalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    surname: '',
    address: '',
    phone: '',
    town: '',
    notes: '',
  });

  const handleSubmit = async () => {
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
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=representation',
        },
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
          status: 'pending',
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      clearCart();
      toast('Ordine inviato con successo!', 'success');
      router.push('/order-success');
    } catch (error: any) {
      console.error('Order error:', error);
      toast('Errore durante l\'invio dell\'ordine', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Empty cart
  if (items.length === 0) {
    return (
      <main className="mobile-container pb-safe" style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
        <header style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ width: '44px', height: '44px', borderRadius: '22px', backgroundColor: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
          </Link>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#F5F5F0', margin: 0 }}>Il Tuo Ordine</h1>
        </header>

        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2A2A2A" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#F5F5F0', marginBottom: '8px' }}>Carrello vuoto</h2>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>Aggiungi prodotti per iniziare</p>
          <Link href="/" style={{
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
          }}>
            Sfoglia Prodotti
          </Link>
        </div>

        <BottomNav />
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ width: '44px', height: '44px', borderRadius: '22px', backgroundColor: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
                <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
              </svg>
            </Link>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#F5F5F0', margin: 0 }}>Il Tuo Ordine</h1>
          </div>
        </div>
      </header>

      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto', paddingBottom: '100px' }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {items.map((item) => (
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
              {/* Image */}
              <div style={{ width: '80px', height: '80px', flexShrink: 0, position: 'relative', backgroundColor: '#1E1E1E' }}>
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" style={{ opacity: 0.5 }}>
                      <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h3 style={{ fontWeight: 600, color: '#F5F5F0', fontSize: '14px', margin: 0 }}>{item.name}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  {/* Quantity controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1E1E1E', borderRadius: '8px', padding: '4px' }}>
                    <button
                      onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                      style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#121212', border: 'none', cursor: 'pointer' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
                        <path d="M5 12h14"/>
                      </svg>
                    </button>
                    <span style={{ width: '28px', textAlign: 'center', fontSize: '15px', fontWeight: 700, color: '#F5F5F0' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#121212', border: 'none', cursor: 'pointer' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Data Form */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#38BDF8', marginBottom: '16px' }}>Dati Cliente</h2>
          
          {/* Name & Surname Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nome *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome"
                style={{
                  width: '100%',
                  backgroundColor: '#121212',
                  border: '1px solid #2A2A2A',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#F5F5F0',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cognome *</label>
              <input
                type="text"
                value={form.surname}
                onChange={(e) => setForm({ ...form, surname: e.target.value })}
                placeholder="Cognome"
                style={{
                  width: '100%',
                  backgroundColor: '#121212',
                  border: '1px solid #2A2A2A',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#F5F5F0',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Address */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Indirizzo *</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Via/Piazza, Numero"
              style={{
                width: '100%',
                backgroundColor: '#121212',
                border: '1px solid #2A2A2A',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#F5F5F0',
                fontSize: '15px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Town & Phone Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Paese *</label>
              <input
                type="text"
                value={form.town}
                onChange={(e) => setForm({ ...form, town: e.target.value })}
                placeholder="Paese"
                style={{
                  width: '100%',
                  backgroundColor: '#121212',
                  border: '1px solid #2A2A2A',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#F5F5F0',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Telefono *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Telefono"
                style={{
                  width: '100%',
                  backgroundColor: '#121212',
                  border: '1px solid #2A2A2A',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#F5F5F0',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Note (opzionale)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Note aggiuntive..."
              style={{
                width: '100%',
                backgroundColor: '#121212',
                border: '1px solid #2A2A2A',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#F5F5F0',
                fontSize: '15px',
                minHeight: '80px',
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '16px',
            backgroundColor: '#38BDF8',
            borderRadius: '12px',
            border: 'none',
            color: '#0A0A0A',
            fontWeight: 700,
            fontSize: '17px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <div style={{ width: '24px', height: '24px', border: '3px solid #0A0A0A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
              </svg>
              Invia Ordine
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginTop: '12px' }}>
          Pagamento alla consegna
        </p>
      </div>

      <BottomNav />

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

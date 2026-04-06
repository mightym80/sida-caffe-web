"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from '@/components/toaster';

const ADMIN_PASSWORD = 'sida2026';
const SUPABASE_URL = 'https://wyvcwibhcayassfqgofh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7rHj-FAXCRRI93wBhJSwfg_Zq2k568V';

interface OrderItem {
  product_name: string;
  quantity: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_surname: string;
  customer_address: string;
  customer_phone: string;
  customer_town: string;
  items: OrderItem[];
  total_items: number;
  order_type: string;
  notes: string;
  status: string;
  created_at: string;
  delivered_at: string | null;
}

async function getOrders(status: string): Promise<Order[]> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?status=eq.${status}&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        cache: 'no-store',
      }
    );
    return response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

async function updateOrder(id: string, data: any) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify(data),
    }
  );
  return response.ok;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDelivered, setShowDelivered] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sida-admin-pwd');
    if (saved !== ADMIN_PASSWORD) router.push('/admin');
  }, [router]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const data = await getOrders(showDelivered ? 'delivered' : 'pending');
    setOrders(data || []);
    setLoading(false);
  }, [showDelivered]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleLogout = () => { 
    localStorage.removeItem('sida-admin-pwd'); 
    router.push('/admin'); 
  };

  const handleDeliver = async (id: string) => {
    const success = await updateOrder(id, { 
      status: 'delivered', 
      delivered_at: new Date().toISOString() 
    });
    if (success) {
      toast('Consegnato', 'success');
      loadOrders();
    } else {
      toast('Errore', 'error');
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleString('it-IT', { 
    day: '2-digit', 
    month: '2-digit', 
    year: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const ordersByTown = orders.reduce((acc, o) => { 
    const t = o.customer_town || 'Altro'; 
    if (!acc[t]) acc[t] = []; 
    acc[t].push(o); 
    return acc; 
  }, {} as Record<string, Order[]>);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#050505', paddingBottom: '20px' }}>
      {/* Header */}
      <header style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#D4AF37', margin: 0 }}>SIDA Caffè</h1>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '2px' }}>Gestione Ordini ({orders.length})</p>
        </div>
        <button onClick={handleLogout} style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: '#1A1A1A', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        </button>
      </header>

      {/* Nav Buttons */}
      <div style={{ padding: '0 16px', display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <Link href="/admin/products" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', backgroundColor: '#121212', borderRadius: '12px', border: '1px solid #D4AF37', textDecoration: 'none' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#D4AF37' }}>Prodotti</span>
        </Link>
        <Link href="/admin/promotions" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', backgroundColor: '#121212', borderRadius: '12px', border: '1px solid #D4AF37', textDecoration: 'none' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#D4AF37' }}>Promozioni</span>
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 16px', display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <button onClick={() => { setShowDelivered(false); }} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: !showDelivered ? '#D4AF37' : '#121212', color: !showDelivered ? '#0A0A0A' : '#888', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>Da Consegnare</button>
        <button onClick={() => { setShowDelivered(true); }} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: showDelivered ? '#D4AF37' : '#121212', color: showDelivered ? '#0A0A0A' : '#888', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>Consegnati</button>
      </div>

      {/* Export */}
      <div style={{ padding: '0 16px', marginBottom: '16px' }}>
        <button style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #D4AF37', backgroundColor: 'transparent', color: '#D4AF37', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          Esporta Lista
        </button>
      </div>

      {/* Orders */}
      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #D4AF37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : orders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>{showDelivered ? 'Nessun ordine consegnato' : 'Nessun ordine in attesa'}</p>
        ) : (
          Object.entries(ordersByTown).map(([town, townOrders]) => (
            <div key={town} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '4px', height: '24px', backgroundColor: '#D4AF37', borderRadius: '2px', marginRight: '12px' }}></div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#D4AF37', margin: 0 }}>{town}</h3>
                <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#666', backgroundColor: '#1A1A1A', padding: '4px 12px', borderRadius: '12px' }}>{townOrders.length}</span>
              </div>
              {townOrders.map((order) => (
                <div key={order.id} style={{ backgroundColor: '#0A0A0A', borderRadius: '16px', border: '1px solid #D4AF37', marginBottom: '12px', padding: '16px', borderLeft: '4px solid #D4AF37' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '17px', fontWeight: 600, color: '#F5F5F0', margin: 0 }}>{order.customer_name} {order.customer_surname}</p>
                      <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{formatDate(order.created_at)}</p>
                    </div>
                    {!showDelivered && (
                      <button onClick={() => handleDeliver(order.id)} style={{ width: '44px', height: '44px', borderRadius: '22px', border: '2px solid #3A3A3A', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      </button>
                    )}
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span style={{ fontSize: '14px', color: '#AAA' }}>{order.customer_address}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
                      <a href={`tel:${order.customer_phone}`} style={{ fontSize: '14px', color: '#AAA', textDecoration: 'none' }}>{order.customer_phone}</a>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', backgroundColor: '#1A1A1A', borderRadius: '10px', padding: '12px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', marginBottom: idx < order.items.length - 1 ? '6px' : 0 }}>
                        <span style={{ fontSize: '14px', color: '#AAA', width: '30px' }}>{item.quantity}x</span>
                        <span style={{ fontSize: '14px', color: '#F5F5F0', flex: 1 }}>{item.product_name}</span>
                      </div>
                    ))}
                  </div>
                  {order.notes && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
                      <span style={{ fontSize: '13px', color: '#D4AF37' }}>{order.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

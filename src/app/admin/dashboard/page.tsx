"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Package, RefreshCw, Check, Clock, MapPin, Phone, User, FileText, Loader2, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { supabase, Order } from '@/lib/supabase';
import { toast } from '@/components/toaster';

const ADMIN_PASSWORD = 'sida2026';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDelivered, setShowDelivered] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('sida-admin-pwd');
    if (saved !== ADMIN_PASSWORD) {
      router.push('/admin');
    }
  }, [router]);

  const loadOrders = useCallback(async () => {
    try {
      const status = showDelivered ? 'delivered' : 'pending';
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast('Errore caricamento ordini', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showDelivered]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleLogout = () => {
    localStorage.removeItem('sida-admin-pwd');
    router.push('/admin');
  };

  const handleDeliver = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered', delivered_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      toast('Ordine segnato come consegnato', 'success');
      loadOrders();
    } catch (error) {
      toast('Errore aggiornamento ordine', 'error');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Eliminare questo ordine?')) return;
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      toast('Ordine eliminato', 'success');
      loadOrders();
    } catch (error) {
      toast('Errore eliminazione ordine', 'error');
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Group orders by town
  const ordersByTown = orders.reduce((acc, order) => {
    const town = order.customer_town || 'Altro';
    if (!acc[town]) acc[town] = [];
    acc[town].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary">SIDA Caffè</h1>
            <p className="text-xs text-text-secondary">Dashboard ({orders.length} ordini)</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-full bg-surface hover:bg-surface-highlight transition-colors"
            >
              <RefreshCw size={18} className={`text-text-secondary ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-surface hover:bg-error/20 transition-colors"
            >
              <LogOut size={18} className="text-error" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-2xl mx-auto px-4 py-4 flex gap-2">
        <Link
          href="/admin/products"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-surface border border-border rounded-xl text-text-primary font-medium hover:bg-surface-highlight transition-colors"
        >
          <Package size={18} />
          Gestione Prodotti
        </Link>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 flex gap-2 mb-4">
        <button
          onClick={() => { setShowDelivered(false); setLoading(true); }}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
            !showDelivered ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary'
          }`}
        >
          <Clock size={16} className="inline mr-1" />
          In Attesa
        </button>
        <button
          onClick={() => { setShowDelivered(true); setLoading(true); }}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
            showDelivered ? 'bg-success text-white' : 'bg-surface text-text-secondary'
          }`}
        >
          <Check size={16} className="inline mr-1" />
          Consegnati
        </button>
      </div>

      {/* Orders */}
      <section className="max-w-2xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 size={32} className="text-primary mx-auto animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="text-text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary">
              {showDelivered ? 'Nessun ordine consegnato' : 'Nessun ordine in attesa'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(ordersByTown).map(([town, townOrders]) => (
              <div key={town}>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-text-secondary mb-3">
                  <MapPin size={14} />
                  {town} ({townOrders.length})
                </h3>
                <div className="space-y-3">
                  {townOrders.map((order) => (
                    <div key={order.id} className="bg-surface rounded-xl border border-border overflow-hidden">
                      <div
                        onClick={() => toggleExpand(order.id)}
                        className="p-4 cursor-pointer hover:bg-surface-highlight transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <User size={14} className="text-primary" />
                              <span className="font-semibold text-text-primary">
                                {order.customer_name} {order.customer_surname}
                              </span>
                              {order.order_type === 'assistance' && (
                                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">Assistenza</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                              <Clock size={12} />
                              {formatDate(order.created_at)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary">{order.total_items} pz</span>
                            {expandedOrders.has(order.id) ? (
                              <ChevronUp size={18} className="text-text-secondary" />
                            ) : (
                              <ChevronDown size={18} className="text-text-secondary" />
                            )}
                          </div>
                        </div>
                      </div>

                      {expandedOrders.has(order.id) && (
                        <div className="border-t border-border p-4 bg-surface-highlight/50">
                          <div className="space-y-2 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-text-secondary" />
                              <a href={`tel:${order.customer_phone}`} className="text-primary">{order.customer_phone}</a>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin size={14} className="text-text-secondary mt-0.5" />
                              <span className="text-text-primary">{order.customer_address}</span>
                            </div>
                            {order.notes && (
                              <div className="flex items-start gap-2">
                                <FileText size={14} className="text-text-secondary mt-0.5" />
                                <span className="text-text-secondary">{order.notes}</span>
                              </div>
                            )}
                          </div>

                          <div className="bg-background rounded-lg p-3 mb-4">
                            <p className="text-xs text-text-secondary mb-2">Prodotti:</p>
                            {(order.items as any[]).map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-text-primary">{item.product_name}</span>
                                <span className="text-primary font-medium">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            {!showDelivered && (
                              <button
                                onClick={() => handleDeliver(order.id)}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-success text-white rounded-lg font-medium text-sm hover:bg-success/90 transition-colors"
                              >
                                <Check size={16} />
                                Consegnato
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="p-2 bg-error/20 text-error rounded-lg hover:bg-error/30 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

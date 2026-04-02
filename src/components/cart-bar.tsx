"use client";

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export function CartBar() {
  const { totalItems } = useCart();

  if (totalItems === 0) return null;

  return (
    <Link
      href="/cart"
      style={{
        position: 'fixed',
        bottom: '76px',
        left: '16px',
        right: '16px',
        maxWidth: '448px',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#38BDF8',
        padding: '14px 20px',
        borderRadius: '16px',
        zIndex: 40,
        boxShadow: '0 4px 20px rgba(56, 189, 248, 0.4)',
        textDecoration: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="21" r="1"/>
          <circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
        <div
          style={{
            marginLeft: '8px',
            width: '24px',
            height: '24px',
            borderRadius: '12px',
            backgroundColor: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFF' }}>{totalItems}</span>
        </div>
      </div>
      <span style={{ fontSize: '16px', fontWeight: 700, color: '#0A0A0A' }}>Vedi Carrello</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"/>
        <path d="m12 5 7 7-7 7"/>
      </svg>
    </Link>
  );
}

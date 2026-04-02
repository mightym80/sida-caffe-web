"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#0A0A0A',
      borderTop: '1px solid #1A1A1A',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '65px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {/* Prodotti */}
        <Link href="/" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          height: '100%',
          textDecoration: 'none'
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={isActive('/') ? '#38BDF8' : 'none'} stroke={isActive('/') ? '#38BDF8' : '#666666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            <line x1="6" x2="6" y1="2" y2="4"/>
            <line x1="10" x2="10" y1="2" y2="4"/>
            <line x1="14" x2="14" y1="2" y2="4"/>
          </svg>
          <span style={{
            fontSize: '11px',
            marginTop: '4px',
            fontWeight: 500,
            color: isActive('/') ? '#38BDF8' : '#666666'
          }}>Prodotti</span>
        </Link>

        {/* Preferiti */}
        <Link href="/favorites" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          height: '100%',
          textDecoration: 'none'
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={isActive('/favorites') ? '#38BDF8' : 'none'} stroke={isActive('/favorites') ? '#38BDF8' : '#666666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <span style={{
            fontSize: '11px',
            marginTop: '4px',
            fontWeight: 500,
            color: isActive('/favorites') ? '#38BDF8' : '#666666'
          }}>Preferiti</span>
        </Link>

        {/* Promozioni */}
        <Link href="/promotions" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          height: '100%',
          textDecoration: 'none'
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={isActive('/promotions') ? '#38BDF8' : 'none'} stroke={isActive('/promotions') ? '#38BDF8' : '#666666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/>
            <circle cx="17" cy="7" r="5"/>
          </svg>
          <span style={{
            fontSize: '11px',
            marginTop: '4px',
            fontWeight: 500,
            color: isActive('/promotions') ? '#38BDF8' : '#666666'
          }}>Promozioni</span>
        </Link>

        {/* Assistenza */}
        <Link href="/assistance" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          height: '100%',
          textDecoration: 'none'
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isActive('/assistance') ? '#38BDF8' : '#666666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <span style={{
            fontSize: '11px',
            marginTop: '4px',
            fontWeight: 500,
            color: isActive('/assistance') ? '#38BDF8' : '#666666'
          }}>Assistenza</span>
        </Link>
      </div>
    </nav>
  );
}

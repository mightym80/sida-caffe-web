"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  {
    href: '/',
    label: 'Prodotti',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#38BDF8' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
        <line x1="6" x2="6" y1="2" y2="4"/>
        <line x1="10" x2="10" y1="2" y2="4"/>
        <line x1="14" x2="14" y1="2" y2="4"/>
      </svg>
    ),
  },
  {
    href: '/favorites',
    label: 'Preferiti',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#38BDF8' : 'none'} stroke={active ? '#38BDF8' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    ),
  },
  {
    href: '/promotions',
    label: 'Promozioni',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#38BDF8' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/>
        <circle cx="17" cy="7" r="5"/>
      </svg>
    ),
  },
  {
    href: '/assistance',
    label: 'Assistenza',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#7DD3FC' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#121212',
        borderTop: '1px solid #2A2A2A',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '60px',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const isAssistance = tab.href === '/assistance';
          const activeColor = isAssistance ? '#7DD3FC' : '#38BDF8';
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                height: '100%',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ marginBottom: '4px' }}>
                {tab.icon(active)}
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: active ? 600 : 500,
                  color: active ? activeColor : '#666',
                  letterSpacing: '0.3px',
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

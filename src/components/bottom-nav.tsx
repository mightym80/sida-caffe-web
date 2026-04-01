"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, Heart, Tag, Wrench } from 'lucide-react';

const navItems = [
  { href: '/', icon: Coffee, label: 'Prodotti' },
  { href: '/favorites', icon: Heart, label: 'Preferiti' },
  { href: '/promotions', icon: Tag, label: 'Promozioni' },
  { href: '/assistance', icon: Wrench, label: 'Assistenza' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#2A2A2A] z-50 safe-area-pb">
      <div className="flex justify-around items-center py-3">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href === '/' && pathname === '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center min-w-[70px]"
            >
              <Icon 
                size={24} 
                className={isActive ? 'text-[#D4AF37]' : 'text-[#666666]'}
                fill={isActive ? '#D4AF37' : 'none'}
              />
              <span className={`text-[11px] mt-1 font-medium ${isActive ? 'text-[#D4AF37]' : 'text-[#666666]'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

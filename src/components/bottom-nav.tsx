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
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#1A1A1A] z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center flex-1 h-full"
            >
              <Icon 
                size={24} 
                className={isActive ? 'text-[#38BDF8]' : 'text-[#555555]'}
                fill={isActive ? '#38BDF8' : 'none'}
              />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-[#38BDF8]' : 'text-[#555555]'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

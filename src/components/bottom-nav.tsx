"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Gift, Wrench } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/favorites', icon: Heart, label: 'Preferiti' },
  { href: '/promotions', icon: Gift, label: 'Promo' },
  { href: '/assistance', icon: Wrench, label: 'Assistenza' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-[#2A2A2A] z-50">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                isActive
                  ? 'text-[#38BDF8]'
                  : 'text-[#A3A3A3]'
              }`}
            >
              <Icon size={22} />
              <span className="text-[11px] mt-1 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

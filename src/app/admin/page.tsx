"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from '@/components/toaster';

const ADMIN_PASSWORD = 'sida2026';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sida-admin-pwd');
    if (saved === ADMIN_PASSWORD) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('sida-admin-pwd', password);
      router.push('/admin/dashboard');
    } else {
      toast('Password non valida', 'error');
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#050505', padding: '16px' }}>
      {/* Back Button */}
      <Link href="/" style={{ display: 'inline-flex', width: '48px', height: '48px', borderRadius: '24px', backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      </Link>

      {/* Center Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 150px)', padding: '0 20px' }}>
        {/* Lock Icon */}
        <div style={{ width: '100px', height: '100px', borderRadius: '50px', border: '3px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="#D4AF37" stroke="#D4AF37" strokeWidth="2">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#F5F5F0', margin: '0 0 8px 0' }}>Pannello Admin</h1>
        <p style={{ fontSize: '15px', color: '#888', margin: '0 0 40px 0' }}>Inserisci la password per accedere</p>

        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '350px' }}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: '100%',
                backgroundColor: '#121212',
                border: '1px solid #3A3A3A',
                borderRadius: '12px',
                padding: '16px 50px 16px 16px',
                fontSize: '16px',
                color: '#F5F5F0',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                {showPassword ? (
                  <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" x2="23" y1="1" y2="23"/></>
                ) : (
                  <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                )}
              </svg>
            </button>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#D4AF37',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '17px',
              fontWeight: 700,
              color: '#0A0A0A',
              cursor: 'pointer'
            }}
          >
            Accedi
          </button>
        </form>
      </div>
    </main>
  );
}

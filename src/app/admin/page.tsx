"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, LogIn, Coffee } from 'lucide-react';
import { toast } from '@/components/toaster';

const ADMIN_PASSWORD = 'sida2026';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sida-admin-pwd');
    if (saved === ADMIN_PASSWORD) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('sida-admin-pwd', password);
      toast('Accesso effettuato', 'success');
      router.push('/admin/dashboard');
    } else {
      toast('Password non valida', 'error');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">SIDA Caffè</h1>
          <p className="text-text-secondary mt-1">Pannello Amministrazione</p>
        </div>

        <form onSubmit={handleLogin} className="bg-surface rounded-xl border border-border p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              <Lock size={16} className="inline mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
              placeholder="Inserisci password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <LogIn size={20} />
            Accedi
          </button>
        </form>
      </div>
    </main>
  );
}

import Link from 'next/link';
import { CheckCircle, Home } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-success" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Ordine Inviato!</h1>
        <p className="text-text-secondary mb-8 max-w-xs mx-auto">
          Grazie per il tuo ordine. Ti contatteremo presto per confermare la consegna.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          <Home size={20} />
          Torna alla Home
        </Link>
      </div>
    </main>
  );
}

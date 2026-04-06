import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '320px' }}>
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '40px',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <path d="m9 11 3 3L22 4"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#F5F5F0', marginBottom: '8px' }}>
          Ordine Inviato!
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '15px', marginBottom: '32px', lineHeight: 1.5 }}>
          Grazie per il tuo ordine. Ti contatteremo presto per confermare la consegna.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            backgroundColor: '#38BDF8',
            color: '#0A0A0A',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '16px',
            textDecoration: 'none',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Torna alla Home
        </Link>
      </div>
    </main>
  );
}

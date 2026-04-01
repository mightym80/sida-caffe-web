# SIDA Caffè - Web App

App per ordini caffè a domicilio.

## Setup Locale

```bash
npm install
npm run dev
```

## Variabili d'Ambiente

Crea un file `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Database Setup

Esegui lo script SQL in `src/lib/database.sql` nella console Supabase.

## Deploy su Vercel

1. Push su GitHub
2. Connetti repo a Vercel
3. Aggiungi variabili d'ambiente
4. Deploy!

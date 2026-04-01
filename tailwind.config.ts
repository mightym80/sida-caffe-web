import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#121212',
        'surface-highlight': '#1E1E1E',
        border: '#2A2A2A',
        primary: '#38BDF8',
        'primary-foreground': '#0A0A0A',
        'text-primary': '#F5F5F0',
        'text-secondary': '#A3A3A3',
        accent: '#7DD3FC',
        error: '#EF4444',
        success: '#22C55E',
      },
    },
  },
  plugins: [],
} satisfies Config;

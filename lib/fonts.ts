import { Inter, Satisfy } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const satisfy = Satisfy({
  subsets: ['latin'],
  variable: '--font-satisfy',
  display: 'swap',
  weight: '400',
});

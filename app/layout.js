/**
 * layout.js — Server Component (não tem 'use client').
 * Vale para todas as páginas: fonte, metadata e o vídeo de fundo.
 */
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';
import FundoVideo from '../components/FundoVideo';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui',
});

export const metadata = {
  title: 'Neon Dice',
  description:
    'Duelo local de dados em React: 2 jogadores, 5 rodadas, skins, save no navegador e mesa com dados 3D.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={`${sora.variable} ${jakarta.variable}`}>
      <body>
        <FundoVideo />
        {children}
      </body>
    </html>
  );
}

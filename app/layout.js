/**
 * layout.js — Server Component (não tem 'use client').
 * Vale para todas as páginas: fonte, metadata e o vídeo de fundo.
 *
 * SEO no App Router: este `metadata` vira as mesmas <meta> do HTML
 * (title, description, Open Graph, Twitter). Não usa next/head.
 * Favicon e imagem de compartilhamento vêm dos arquivos em app/:
 * icon.png, apple-icon.png, opengraph-image.jpg.
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

const siteUrl = 'https://joga-dados-unicap.vercel.app';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Jogue Dados',
    template: '%s · Jogue Dados',
  },
  description:
    'Jogue Dados: duelo local em Next.js — 2 jogadores, 5 rodadas, no mesmo aparelho. Maior soma vence a rodada.',
  applicationName: 'Jogue Dados',
  authors: [{ name: 'Vanessa Rafaella Carneiro de Lima' }],
  keywords: ['jogo de dados', 'Jogue Dados', 'Next.js', 'React', 'UNICAP', 'dois jogadores'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Jogue Dados',
    title: 'Jogue Dados',
    description:
      'Jogue Dados: dois jogadores, cinco rodadas, um aparelho. Só um botão Jogar fica ativo por vez.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jogue Dados',
    description:
      'Jogue Dados: duelo local de dados — 2 jogadores, 5 rodadas, no mesmo aparelho.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#050810',
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

import type { Metadata } from 'next';
import { Geist_Mono, Source_Sans_3, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import './quiz-mode.css';

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
});

const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fabric Explorer · DP-600 systems lab',
  description:
    'An interactive systems laboratory for understanding Microsoft Fabric analytics and DP-600 concepts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans.variable} ${sourceSerif.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

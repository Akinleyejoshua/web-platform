import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Bricolage_Grotesque } from 'next/font/google';
import { ThemeProvider } from '@/app/components/providers/theme-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

export const metadata: Metadata = {
  title: 'Joshua | Developer & Creator',
  description: 'A passionate developer creating innovative digital solutions across web, machine learning, and Web3 technologies.',
  keywords: ['portfolio', 'developer', 'web development', 'machine learning', 'web3'],
  authors: [{ name: 'Portfolio Owner' }],
  openGraph: {
    title: 'Portfolio | Developer & Creator',
    description: 'A passionate developer creating innovative digital solutions.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bricolage.variable}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

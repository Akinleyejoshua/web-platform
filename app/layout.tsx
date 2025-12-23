import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/app/components/providers/theme-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Portfolio | Developer & Creator',
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
      <body className={inter.variable}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

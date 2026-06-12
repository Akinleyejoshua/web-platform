import type { Metadata } from 'next';
import { Inter, Poppins, Raleway } from 'next/font/google';
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

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-raleway',
});

const siteUrl = 'https://joshuapro.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Joshua Akinleye | Developer & Creator',
    template: '%s | Joshua Akinleye',
  },
  description:
    'A passionate developer creating innovative digital solutions across web, data analytics, machine learning, and Web3 technologies.',
  keywords: [
    'Joshua Akinleye',
    'portfolio',
    'full-stack developer',
    'web development',
    'machine learning',
    'web3',
    'software engineer',
    'React',
    'Next.js',
  ],
  authors: [{ name: 'Joshua Akinleye' }],
  creator: 'Joshua Akinleye',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Joshua Akinleye | Developer & Creator',
    description:
      'A passionate developer creating innovative digital solutions across web, machine learning, and Web3 technologies.',
    url: siteUrl,
    siteName: 'Joshua Akinleye Portfolio',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/profile_pic.jpeg',
        width: 1200,
        height: 630,
        alt: 'Joshua Akinleye – Developer & Creator',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joshua Akinleye | Developer & Creator',
    description:
      'A passionate developer creating innovative digital solutions across web, machine learning, and Web3 technologies.',
    images: ['/profile_pic.jpeg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bricolage.variable} ${poppins.variable} ${raleway.variable}`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

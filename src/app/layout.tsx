import './globals.css';
import React, { type ReactNode } from 'react';
import { type Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Analytics } from '@vercel/analytics/react';
import { twMerge } from 'tailwind-merge';
import { isProduction } from '@/libs';

const englishFont = Josefin_Sans({ weight: '300', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    isProduction ? 'https://ryoikarashi.com' : 'http://localhost:4000'
  ),
  title: 'RYO IKARASHI',
  description: 'Hi there ✋',
  openGraph: {
    title: 'RYO IKARASHI',
    description: 'Hi there ✋',
    url: 'https://ryoikarashi.com',
    siteName: 'RYO IKARASHI',
    type: 'website',
    images: ['/bg.jpeg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang='en' className='h-full' suppressHydrationWarning>
      <head>
        <meta
          name='theme-color'
          media='(prefers-color-scheme: dark)'
          key='dark-mode'
          content='#333'
        />
      </head>
      <body
        className={twMerge(
          'h-full overflow-hidden bg-white transition duration-300 dark:bg-black',
          englishFont.className
        )}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}

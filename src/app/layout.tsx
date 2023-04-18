import './globals.css';
import React, { type ReactNode } from 'react';
import { type Metadata } from 'next';
import { Noto_Sans_JP, Josefin_Sans } from 'next/font/google';
import { Providers } from '@/app/providers';
import { Analytics } from '@vercel/analytics/react';
import { twMerge } from 'tailwind-merge';

export const dynamic = 'force-dynamic';

const japaneseFont = Noto_Sans_JP({ weight: '300', subsets: ['latin'] });
const englishFont = Josefin_Sans({ weight: '300', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RYO IKARASHI',
  description: 'Hi there ✋',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang='en' className='h-full'>
      <head>
        <meta
          name='theme-color'
          media='(prefers-color-scheme: light)'
          key='light-mode'
          content='#fff'
        />
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
          englishFont.className,
          japaneseFont.className
        )}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}

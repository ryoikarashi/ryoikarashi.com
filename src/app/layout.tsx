import './globals.css';
import React, { type ReactNode } from 'react';
import { Noto_Sans_JP, Josefin_Sans } from 'next/font/google';
import { Providers } from '@/app/providers';

const japaneseFont = Noto_Sans_JP({ weight: '300', subsets: ['latin'] });
const englishFont = Josefin_Sans({ weight: '300', subsets: ['latin'] });

export const metadata = {
  title: 'RYO IKARASHI',
  description: 'Hi there ✋',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang='en'>
      <body
        className={`transition duration-300 ${englishFont.className} ${japaneseFont.className} bg-white dark:bg-black`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
import React, { Suspense } from 'react';
import NextImage from 'next/image';
import { getPlaiceholder } from 'plaiceholder';
import { type HTMLElementProps } from '@/components/atoms';
import { getRandomPhoto, preloadRandomPhoto } from '@/clientApis/photo';

async function DynamicPhoto(): Promise<JSX.Element> {
  preloadRandomPhoto();
  const photo = await getRandomPhoto();
  const { base64, img } = await getPlaiceholder(photo.url);

  return (
    <NextImage
      src={img.src}
      height={img.height}
      width={img.width}
      priority={true}
      placeholder='blur'
      blurDataURL={base64}
      alt=''
      style={{ height: '100%' }}
    />
  );
}

function Loading(): JSX.Element {
  return (
    <div className='flex w-full max-w-[1000px] items-center justify-center'>
      <div className='relative w-full'>
        <div className='aspect-[5/3] w-full animate-pulse bg-black/10 dark:bg-white/10' />
      </div>
    </div>
  );
}

export type PhotoProps = HTMLElementProps<HTMLDivElement>;
export function Image(props: PhotoProps): JSX.Element {
  return (
    <div
      {...props}
      className={`flex h-full w-full items-center justify-center ${
        props.className ?? ''
      }`}
    >
      <Suspense fallback={<Loading />}>
        {/* @ts-expect-error Server Component */}
        <DynamicPhoto />
      </Suspense>
    </div>
  );
}

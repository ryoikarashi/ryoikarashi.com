import React, { Suspense } from 'react';
import Image from 'next/image';
import { getPlaiceholder } from 'plaiceholder';
import { type HTMLElementProps } from '@/components/atoms';
import { getRandomPhoto, preloadRandomPhoto } from '@/clientApis/photo';

async function DynamicPhoto(): Promise<JSX.Element> {
  preloadRandomPhoto();
  const photo = await getRandomPhoto();
  const { base64, img } = await getPlaiceholder(photo.url);

  return (
    <Image
      className={`mx-auto max-w-xs border border-black dark:border-white md:max-w-lg lg:max-w-2xl`}
      src={img.src}
      height={img.height}
      width={img.width}
      priority={true}
      placeholder='blur'
      blurDataURL={base64}
      alt=''
    />
  );
}

function Loading(): JSX.Element {
  return (
    <div className='mx-auto w-screen max-w-xs border border-black dark:border-white md:max-w-lg lg:max-w-2xl'>
      <div className='relative'>
        <div className='bg-dark/10 aspect-[5/3] w-full animate-pulse dark:bg-white/10'></div>
      </div>
    </div>
  );
}

export type PhotoProps = HTMLElementProps<HTMLDivElement>;
export function Photo(props: PhotoProps): JSX.Element {
  return (
    <div {...props}>
      <Suspense fallback={<Loading />}>
        {/* @ts-expect-error Server Component */}
        <DynamicPhoto />
      </Suspense>
    </div>
  );
}

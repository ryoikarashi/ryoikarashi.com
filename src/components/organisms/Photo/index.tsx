import Image from 'next/image';
import { getPlaiceholder } from 'plaiceholder';
import { api } from '@/clientApis';
import { HTMLElementProps } from '@/components/atoms';

export type PhotoProps = HTMLElementProps<HTMLDivElement>;

async function Photo(props: PhotoProps) {
  api.photo.random.get.preload();
  const photo = await api.photo.random.get.request();
  const { base64, img } = await getPlaiceholder(photo.url);

  return (
    <div {...props}>
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
    </div>
  );
}

function Loading() {
  return (
    // <div className="max-w-xs md:max-w-lg lg:max-w-2xl mx-auto border border-black dark:border-white mx-12">
    <div className='mx-auto w-full max-w-xs border border-black dark:border-white md:max-w-lg lg:max-w-2xl'>
      <div className='relative'>
        <div className='bg-dark/10 aspect-video w-full animate-pulse dark:bg-white/10'></div>
      </div>
    </div>
  );
}

Photo.Loading = Loading;

export default Photo;

import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";
import { api } from "@/clientApis";
import { HTMLElementProps } from "@/components/atoms";

export type PhotoProps = HTMLElementProps<HTMLDivElement>;

async function Photo(props: PhotoProps) {
  api.photo.random.get.preload();
  const photo = await api.photo.random.get.request();
  const { base64, img } = await getPlaiceholder(photo.url);

  return (
    <div {...props}>
      <Image
        className={`max-w-xs md:max-w-lg lg:max-w-2xl mx-auto border border-black dark:border-white`}
        src={img.src}
        height={img.height}
        width={img.width}
        priority={true}
        placeholder="blur"
        blurDataURL={base64}
        alt=""
      />
    </div>
  );
}

function Loading() {
  return (
    // <div className="max-w-xs md:max-w-lg lg:max-w-2xl mx-auto border border-black dark:border-white mx-12">
    <div className="max-w-xs md:max-w-lg lg:max-w-2xl mx-auto border border-black dark:border-white w-full">
      <div className="relative">
        <div className="w-full aspect-video bg-dark/10 dark:bg-white/10 animate-pulse"></div>
      </div>
    </div>
  );
}

Photo.Loading = Loading;

export default Photo;

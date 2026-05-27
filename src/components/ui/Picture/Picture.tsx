import type { ImgHTMLAttributes } from 'react';

export type PictureSource = {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
};

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  picture: PictureSource;
  sizes?: string;
  pictureClassName?: string;
};

export function Picture({
  picture,
  sizes,
  alt = '',
  loading = 'lazy',
  decoding = 'async',
  pictureClassName,
  width,
  height,
  ...imgProps
}: Props) {
  const { sources, img } = picture;
  return (
    <picture className={pictureClassName} style={{ display: 'contents' }}>
      {Object.entries(sources).map(([type, srcSet]) => (
        <source key={type} type={type} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        src={img.src}
        width={width ?? img.w}
        height={height ?? img.h}
        alt={alt}
        loading={loading}
        decoding={decoding}
        sizes={sizes}
        {...imgProps}
      />
    </picture>
  );
}

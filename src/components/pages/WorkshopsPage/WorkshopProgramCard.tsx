import { ImageActionCard } from '@/components/ui/ImageActionCard/ImageActionCard';
import type { PictureSource } from '@/components/ui/Picture';

export interface WorkshopProgramCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  picture?: PictureSource;
  imageSrcSet?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  showAction?: boolean;
  actionLabel?: string;
  actionHref?: string;
}

export function WorkshopProgramCard({
  title,
  description,
  image,
  picture,
  imageSrcSet,
  imageWidth,
  imageHeight,
  imageAlt = '',
  showAction = true,
  actionLabel = 'Записаться',
  actionHref = '#workshops-signup',
}: WorkshopProgramCardProps) {
  return (
    <ImageActionCard
      variant="preview"
      title={title}
      description={description}
      image={image}
      picture={picture}
      imageSrcSet={imageSrcSet}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
      imageAlt={imageAlt}
      imageSizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
      href={showAction ? actionHref : undefined}
      actionLabel={showAction ? actionLabel : undefined}
    />
  );
}

import { ImageActionCard } from '@/components/ui/ImageActionCard';
import type { Direction } from '@/data/directions';
import { resolveDirectionHref } from '@/lib/directions';

interface DirectionCardProps {
  direction: Direction;
  variant?: 'overlay' | 'preview';
}

export function DirectionCard({ direction, variant = 'overlay' }: DirectionCardProps) {
  return (
    <ImageActionCard
      variant={variant}
      actionVariant="outline"
      title={direction.title}
      description={direction.description}
      image={direction.image}
      picture={direction.picture}
      imageSizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 80vw"
      imageAlt={direction.title}
      href={resolveDirectionHref(direction)}
      actionLabel="Подробнее"
    />
  );
}

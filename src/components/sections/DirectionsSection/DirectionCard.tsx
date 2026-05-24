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
      title={direction.title}
      description={direction.description}
      image={direction.image}
      imageAlt={direction.title}
      href={resolveDirectionHref(direction)}
      actionLabel="Подробнее"
    />
  );
}

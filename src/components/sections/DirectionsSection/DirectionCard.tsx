import { ImageActionCard } from '@/components/ui/ImageActionCard';
import type { Direction } from '@/data/directions';

interface DirectionCardProps {
  direction: Direction;
}

export function DirectionCard({ direction }: DirectionCardProps) {
  return (
    <ImageActionCard
      variant="overlay"
      title={direction.title}
      description={direction.description}
      image={direction.image}
      imageAlt={direction.title}
      href={direction.href}
      actionLabel="Подробнее"
    />
  );
}

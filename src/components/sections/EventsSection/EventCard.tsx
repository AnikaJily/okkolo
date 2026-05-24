import { ImageActionCard } from '@/components/ui/ImageActionCard/ImageActionCard';
import type { OkkoloEvent } from '@/data/events';

interface EventCardProps {
  event: OkkoloEvent;
  onSignup?: (event: OkkoloEvent) => void;
  onDetails?: (event: OkkoloEvent) => void;
}

export function EventCard({ event, onSignup, onDetails }: EventCardProps) {
  return (
    <ImageActionCard
      variant="preview"
      title={event.title}
      description={event.admission}
      image={event.image}
      href={event.signupHref}
      actionLabel="Записаться"
      action={onSignup ? () => onSignup(event) : undefined}
      secondaryActionLabel="Подробнее"
      secondaryHref={event.href}
      secondaryAction={onDetails ? () => onDetails(event) : undefined}
      meta={event.dateLabel}
    />
  );
}

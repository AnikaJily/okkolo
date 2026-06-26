import { ImageActionCard } from '@/components/ui/ImageActionCard/ImageActionCard';
import type { OkkoloEvent } from '@/data/events';
import { getEventSpots } from '@/lib/events';

interface EventCardProps {
  event: OkkoloEvent;
  onSignup?: (event: OkkoloEvent) => void;
  onDetails?: (event: OkkoloEvent) => void;
}

export function EventCard({ event, onSignup, onDetails }: EventCardProps) {
  const spots = getEventSpots(event);
  const description = spots ? `${event.admission} · ${spots.short}` : event.admission;
  return (
    <ImageActionCard
      variant="preview"
      title={event.title}
      description={description}
      image={event.image}
      picture={event.picture}
      imageSrcSet={event.imageSrcSet}
      imageWidth={event.imageWidth}
      imageHeight={event.imageHeight}
      imageSizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
      href={event.signupHref}
      actionLabel="Записаться"
      action={onSignup ? () => onSignup(event) : undefined}
      secondaryActionLabel="Подробнее"
      secondaryHref={event.href}
      secondaryAction={onDetails ? () => onDetails(event) : undefined}
      actionsLayout="row"
      meta={event.dateLabel}
    />
  );
}

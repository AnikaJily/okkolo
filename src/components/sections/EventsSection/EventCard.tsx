import { ImageActionCard } from '@/components/ui/ImageActionCard';
import type { OkkoloEvent } from '@/data/events';

interface EventCardProps {
  event: OkkoloEvent;
}

export function EventCard({ event }: EventCardProps) {
  const dateLabel = `${event.day} ${event.month}, ${event.time}`;

  return (
    <ImageActionCard
      variant="preview"
      title={event.title}
      description={event.admission}
      image={event.image}
      href={event.href}
      actionLabel="Записаться"
      meta={dateLabel}
    />
  );
}

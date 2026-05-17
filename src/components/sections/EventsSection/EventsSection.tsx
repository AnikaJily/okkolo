import { Button } from '@/components/ui/Button';
import { events } from '@/data/events';
import { EventCard } from './EventCard';
import styles from './EventsSection.module.css';

export function EventsSection() {
  return (
    <section
      id="events"
      className={styles.root}
      aria-labelledby="events-heading"
    >
      <h2 id="events-heading" className={styles.heading}>
        Ближайшие мероприятия
      </h2>

      <ul className={styles.list}>
        {events.map((event) => (
          <li key={event.id}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>

      <div className={styles.cta}>
        <Button variant="outline" size="md" href="/events">
          Все мероприятия
        </Button>
      </div>
    </section>
  );
}

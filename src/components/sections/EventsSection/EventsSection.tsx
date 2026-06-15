import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { events as fallbackEvents } from '@/data/events';
import type { OkkoloEvent } from '@/data/events';
import { HOME_UPCOMING_EVENTS_LIMIT, loadEvents, selectUpcomingEvents } from '@/lib/events';
import { EventCard } from './EventCard';
import { EventDetailsModal } from './EventDetailsModal';
import { EventSignupModal } from './EventSignupModal';
import styles from './EventsSection.module.css';

export function EventsSection() {
  const [events, setEvents] = useState<OkkoloEvent[]>(() =>
    selectUpcomingEvents(fallbackEvents, HOME_UPCOMING_EVENTS_LIMIT),
  );
  const [detailsEvent, setDetailsEvent] = useState<OkkoloEvent | null>(null);
  const [signupEvent, setSignupEvent] = useState<OkkoloEvent | null>(null);

  useEffect(() => {
    loadEvents()
      .then((items) => {
        if (items.length > 0) {
          setEvents(selectUpcomingEvents(items, HOME_UPCOMING_EVENTS_LIMIT));
        }
      })
      .catch(() => {
        // fallback на статичные данные при ошибке сети
      });
  }, []);

  return (
    <section
      id="events"
      className={styles.root}
      aria-labelledby="events-heading"
    >
      <header className={`${styles.head} sectionHeadGap`}>
        <h2 id="events-heading" className={styles.heading}>
          Ближайшие мероприятия
        </h2>
        <p className={styles.lead}>
          Киновечера, лекции и мастер-классы, совместные мероприятия с другими
          организациями города.
        </p>
      </header>

      <ul className={styles.list}>
        {events.map((event) => (
          <li key={event.id}>
            <EventCard event={event} onSignup={setSignupEvent} onDetails={setDetailsEvent} />
          </li>
        ))}
      </ul>

      <div className={styles.cta}>
        <Button variant="primary" size="md" href="/events">
          Посмотреть все мероприятия
        </Button>
      </div>

      <EventDetailsModal
        event={detailsEvent}
        open={detailsEvent !== null}
        onOpenChange={(open) => {
          if (!open) setDetailsEvent(null);
        }}
        onSignup={setSignupEvent}
      />

      <EventSignupModal
        event={signupEvent}
        open={signupEvent !== null}
        onOpenChange={(open) => {
          if (!open) setSignupEvent(null);
        }}
      />
    </section>
  );
}

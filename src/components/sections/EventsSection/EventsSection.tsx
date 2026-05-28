import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { events as fallbackEvents } from '@/data/events';
import type { OkkoloEvent } from '@/data/events';
import { loadEvents } from '@/lib/events';
import { EventCard } from './EventCard';
import { EventDetailsModal } from './EventDetailsModal';
import { EventSignupModal } from './EventSignupModal';
import styles from './EventsSection.module.css';

const UPCOMING_LIMIT = 3;

export function EventsSection() {
  const [events, setEvents] = useState<OkkoloEvent[]>(fallbackEvents);
  const [detailsEvent, setDetailsEvent] = useState<OkkoloEvent | null>(null);
  const [signupEvent, setSignupEvent] = useState<OkkoloEvent | null>(null);

  useEffect(() => {
    loadEvents()
      .then((items) => {
        if (items.length > 0) setEvents(items);
      })
      .catch(() => {
        // fallback на статичные данные при ошибке сети
      });
  }, []);

  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return [...events]
      .filter((event) => new Date(event.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, UPCOMING_LIMIT);
  }, [events]);

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
        {upcomingEvents.map((event) => (
          <li key={event.id}>
            <EventCard event={event} onSignup={setSignupEvent} onDetails={setDetailsEvent} />
          </li>
        ))}
      </ul>

      <div className={styles.cta}>
        <Button variant="primary" size="md" href="/events">
          Все мероприятия
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

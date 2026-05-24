import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { events as fallbackEvents } from '@/data/events';
import type { OkkoloEvent } from '@/data/events';
import { loadEventById } from '@/lib/events';
import styles from './EventDetailPage.module.css';

interface EventDetailPageProps {
  eventId: string;
}

function findFallbackEvent(eventId: string) {
  return fallbackEvents.find((event) => event.id === eventId || event.href.endsWith(`/${eventId}`));
}

export function EventDetailPage({ eventId }: EventDetailPageProps) {
  const [event, setEvent] = useState<OkkoloEvent | undefined>(() => findFallbackEvent(eventId));

  useEffect(() => {
    setEvent(findFallbackEvent(eventId));

    loadEventById(eventId)
      .then((item) => {
        if (item) setEvent(item);
      })
      .catch(() => {
        // fallback на статичные данные при ошибке сети
      });
  }, [eventId]);

  return (
    <main className={styles.root}>
      <a href="/events" className={styles.backLink}>
        <span aria-hidden="true">←</span>
        Мероприятия
      </a>

      {event ? (
        <section className={styles.content} aria-label={event.title}>
          <article className={styles.card}>
            <div className={styles.imagePane}>
              <img
                src={event.image}
                alt={event.title}
                className={styles.image}
                decoding="async"
              />
              <span className={styles.meta}>{event.dateLabel}</span>
            </div>

            <div className={styles.detailsPane}>
              <div className={styles.summary}>
                <h1 className={styles.heading}>{event.title}</h1>
                <p className={styles.admission}>{event.admission}</p>
              </div>

              <Button variant="primary" size="sm" fullWidth href={event.signupHref}>
                Записаться
              </Button>

              {event.description ? (
                <p className={styles.description}>{event.description}</p>
              ) : null}
            </div>
          </article>
        </section>
      ) : (
        <p className={styles.empty}>Мероприятие не найдено.</p>
      )}
    </main>
  );
}

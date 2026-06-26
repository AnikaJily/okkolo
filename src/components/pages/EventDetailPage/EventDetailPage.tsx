import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import { EventSignupModal } from '@/components/sections/EventsSection/EventSignupModal';
import { events as fallbackEvents } from '@/data/events';
import type { OkkoloEvent } from '@/data/events';
import { getEventSpots, loadEventById } from '@/lib/events';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import styles from './EventDetailPage.module.css';

interface EventDetailPageProps {
  eventId: string;
}

function findFallbackEvent(eventId: string) {
  return fallbackEvents.find((event) => event.id === eventId || event.href.endsWith(`/${eventId}`));
}

type LoadState = 'loading' | 'ready' | 'error';

export function EventDetailPage({ eventId }: EventDetailPageProps) {
  const [event, setEvent] = useState<OkkoloEvent | undefined>(() => findFallbackEvent(eventId));
  // «Не найдено» можно показывать только после завершения fetch — иначе
  // CMS-события мелькают ложным 404 (initial state ищет только в моках)
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [retryKey, setRetryKey] = useState(0);
  const [signupOpen, setSignupOpen] = useState(false);
  useDocumentTitle(event?.title);

  useEffect(() => {
    setEvent(findFallbackEvent(eventId));
    setLoadState('loading');

    let cancelled = false;
    loadEventById(eventId)
      .then((item) => {
        if (cancelled) return;
        if (item) setEvent(item);
        setLoadState('ready');
      })
      .catch(() => {
        if (!cancelled) setLoadState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [eventId, retryKey]);

  const spots = event ? getEventSpots(event) : null;

  return (
    <main id="main" className={styles.root}>
      <a href="/events" className={styles.backLink}>
        <span aria-hidden="true">←</span>
        Мероприятия
      </a>

      {event ? (
        <section className={styles.content} aria-label={event.title}>
          <article className={styles.card}>
            <div className={styles.imagePane}>
              {/* alt="" — смысл фото уже выражен соседним h1 (event.title), H67 */}
              {event.picture ? (
                <Picture
                  picture={event.picture}
                  alt=""
                  className={styles.image}
                  loading="eager"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  // @ts-expect-error React typings lag behind the HTML spec
                  fetchpriority="high"
                />
              ) : (
                <img
                  src={event.image}
                  alt=""
                  className={styles.image}
                  loading="eager"
                  decoding="async"
                  // @ts-expect-error React typings lag behind the HTML spec
                  fetchpriority="high"
                />
              )}
              <span className={styles.meta}>{event.dateLabel}</span>
            </div>

            <div className={styles.detailsPane}>
              <div className={styles.summary}>
                <h1 className={styles.heading}>{event.title}</h1>
                <p className={styles.admission}>{event.admission}</p>
                {spots ? <p className={styles.spots}>{spots.label}</p> : null}
              </div>

              {spots?.isFull ? (
                <Button variant="outline" size="sm" fullWidth type="button" disabled>
                  Мест нет
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  type="button"
                  onClick={() => setSignupOpen(true)}
                >
                  Записаться
                </Button>
              )}

              {event.description ? (
                <p className={styles.description}>{event.description}</p>
              ) : null}
            </div>
          </article>
        </section>
      ) : loadState === 'loading' ? (
        <p className={styles.empty} role="status">
          Загружаем мероприятие…
        </p>
      ) : loadState === 'error' ? (
        <div className={styles.errorState}>
          <p className={styles.empty} role="alert">
            Не получилось загрузить мероприятие. Проверьте соединение и
            попробуйте еще раз
          </p>
          <Button
            variant="outline"
            size="md"
            type="button"
            onClick={() => setRetryKey((key) => key + 1)}
          >
            Повторить
          </Button>
        </div>
      ) : (
        <p className={styles.empty}>Мероприятие не найдено.</p>
      )}

      {event ? (
        <EventSignupModal
          event={event}
          open={signupOpen}
          onOpenChange={setSignupOpen}
        />
      ) : null}
    </main>
  );
}

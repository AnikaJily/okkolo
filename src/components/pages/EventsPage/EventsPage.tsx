import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { events as fallbackEvents } from '@/data/events';
import type { OkkoloEvent } from '@/data/events';
import { loadEvents } from '@/lib/events';
import { EventCard } from '@/components/sections/EventsSection/EventCard';
import { EventDetailsModal } from '@/components/sections/EventsSection/EventDetailsModal';
import { EventSignupModal } from '@/components/sections/EventsSection/EventSignupModal';
import arrowSrc from '@/assets/images/arrow.svg';
import styles from './EventsPage.module.css';

const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long' });
const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' });

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function getEventDate(event: OkkoloEvent) {
  return new Date(event.date);
}

function formatMonthLabel(date: Date) {
  const month = monthFormatter.format(date);
  return month[0].toUpperCase() + month.slice(1);
}

function getInitialDate(events: OkkoloEvent[]) {
  const today = new Date();
  const todayKey = getDateKey(today);
  const sorted = [...events].sort((a, b) => getEventDate(a).getTime() - getEventDate(b).getTime());
  const todayEvent = sorted.find((event) => getDateKey(getEventDate(event)) === todayKey);
  const upcomingEvent = sorted.find((event) => getEventDate(event) >= today);
  return getEventDate(todayEvent ?? upcomingEvent ?? sorted[0] ?? fallbackEvents[0]);
}

function getAllDates(events: OkkoloEvent[]): Date[] {
  const byDate = new Map<string, Date>();
  events.forEach((event) => {
    const date = getEventDate(event);
    byDate.set(getDateKey(date), date);
  });
  return [...byDate.values()].sort((a, b) => a.getTime() - b.getTime());
}

type DateGroup = { monthKey: string; label: string; dates: Date[] };

function groupDatesByMonth(dates: Date[]): DateGroup[] {
  const groups: DateGroup[] = [];
  for (const date of dates) {
    const monthKey = getMonthKey(date);
    const last = groups[groups.length - 1];
    if (last && last.monthKey === monthKey) {
      last.dates.push(date);
    } else {
      groups.push({ monthKey, label: formatMonthLabel(date), dates: [date] });
    }
  }
  return groups;
}

export function EventsPage() {
  const [events, setEvents] = useState<OkkoloEvent[]>(fallbackEvents);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(
    () => getDateKey(getInitialDate(fallbackEvents)),
  );
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);
  const [detailsEvent, setDetailsEvent] = useState<OkkoloEvent | null>(null);
  const [signupEvent, setSignupEvent] = useState<OkkoloEvent | null>(null);

  useEffect(() => {
    loadEvents()
      .then((items) => {
        if (items.length === 0) return;
        const initialDate = getInitialDate(items);
        setEvents(items);
        setSelectedDateKey(getDateKey(initialDate));
      })
      .catch(() => {
        // fallback на статичные данные при ошибке сети
      });
  }, []);

  const allDates = useMemo(() => getAllDates(events), [events]);
  const dateGroups = useMemo(() => groupDatesByMonth(allDates), [allDates]);

  const selectedEvents = useMemo(() => {
    if (!selectedDateKey) return [];
    return events.filter((event) => getDateKey(getEventDate(event)) === selectedDateKey);
  }, [events, selectedDateKey]);

  const checkArrow = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setShowArrow(el.scrollWidth > el.clientWidth && !atEnd);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    checkArrow();
    el.addEventListener('scroll', checkArrow, { passive: true });
    const ro = new ResizeObserver(checkArrow);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkArrow);
      ro.disconnect();
    };
  }, [checkArrow, dateGroups]);

  const handleScrollArrow = () => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: Math.round(el.clientWidth * 0.75), behavior: 'smooth' });
  };

  return (
    <main className={styles.root}>
      <h1 className={styles.heading}>Мероприятия</h1>

      <section className={styles.calendar} aria-label="Календарь мероприятий">
        {allDates.length > 0 ? (
          <div className={styles.scrollWrapper}>
            <div
              className={styles.dateScroller}
              ref={scrollerRef}
              role="group"
              aria-label="Выберите дату мероприятия"
            >
              {dateGroups.map((group) => (
                <div key={group.monthKey} className={styles.monthGroup}>
                  <div className={styles.monthLabel}>
                    <span>{group.label}</span>
                  </div>

                  <div className={styles.monthDates}>
                    {group.dates.map((date) => {
                      const dateKey = getDateKey(date);
                      const isSelected = dateKey === selectedDateKey;
                      return (
                        <button
                          key={dateKey}
                          type="button"
                          className={isSelected ? styles.dateButtonActive : styles.dateButton}
                          onClick={() => setSelectedDateKey(dateKey)}
                          aria-pressed={isSelected}
                        >
                          <span className={styles.dateDay}>{date.getDate()}</span>
                          <span className={styles.dateWeekday}>
                            {weekdayFormatter.format(date).replace('.', '')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className={`${styles.scrollArrow}${showArrow ? '' : ` ${styles.scrollArrowHidden}`}`}
              onClick={handleScrollArrow}
              aria-hidden="true"
              tabIndex={-1}
            >
              <img src={arrowSrc} alt="" className={styles.scrollArrowIcon} />
            </button>
          </div>
        ) : (
          <p className={styles.empty}>Мероприятий пока нет.</p>
        )}
      </section>

      <section className={styles.events} aria-label="Список мероприятий">
        {selectedEvents.map((event) => (
          <div key={event.id} className={styles.eventCardWrapper}>
            <EventCard event={event} onSignup={setSignupEvent} onDetails={setDetailsEvent} />
          </div>
        ))}
      </section>

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
    </main>
  );
}

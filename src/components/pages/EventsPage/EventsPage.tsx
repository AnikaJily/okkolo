import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { events as fallbackEvents } from '@/data/events';
import type { OkkoloEvent } from '@/data/events';
import { loadEvents } from '@/lib/events';
import { Checkbox } from '@/components/ui/Checkbox';
import { EventCard } from '@/components/sections/EventsSection/EventCard';
import { EventDetailsModal } from '@/components/sections/EventsSection/EventDetailsModal';
import { EventSignupModal } from '@/components/sections/EventsSection/EventSignupModal';
import filtersIcon from '@/assets/images/filters.svg';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import styles from './EventsPage.module.css';

const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long' });

// Канонический порядок типов из CMS (enum); незнакомые типы добавляем после, по алфавиту.
const TYPE_ORDER = ['музыка', 'мастер-класс', 'лекция', 'стенд-ап'];

type TimeScope = 'this' | 'next';

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getMonday(date: Date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getEventDate(event: OkkoloEvent) {
  return new Date(event.date);
}

function capitalize(value: string) {
  return value.length ? value[0].toUpperCase() + value.slice(1) : value;
}

function formatMonthNominative(date: Date) {
  return capitalize(monthFormatter.format(date));
}

type MonthGroup = {
  monthKey: string;
  label: string;
  events: OkkoloEvent[];
};

function groupByMonth(events: OkkoloEvent[]): MonthGroup[] {
  const sorted = [...events].sort(
    (a, b) => getEventDate(a).getTime() - getEventDate(b).getTime(),
  );
  const months = new Map<string, MonthGroup>();
  for (const event of sorted) {
    const date = getEventDate(event);
    const monthKey = getMonthKey(date);
    let monthGroup = months.get(monthKey);
    if (!monthGroup) {
      monthGroup = { monthKey, label: formatMonthNominative(date), events: [] };
      months.set(monthKey, monthGroup);
    }
    monthGroup.events.push(event);
  }
  return [...months.values()];
}

export function EventsPage() {
  useDocumentTitle('Мероприятия');
  const [events, setEvents] = useState<OkkoloEvent[]>(fallbackEvents);
  const [timeScope, setTimeScope] = useState<TimeScope | null>('this');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [detailsEvent, setDetailsEvent] = useState<OkkoloEvent | null>(null);
  const [signupEvent, setSignupEvent] = useState<OkkoloEvent | null>(null);
  const typeMenuRef = useRef<HTMLDivElement>(null);
  const typeTriggerRef = useRef<HTMLButtonElement>(null);
  const typeMenuId = useId();

  useEffect(() => {
    loadEvents()
      .then((items) => {
        if (items.length === 0) return;
        // Не трогаем выбранные фильтры — их валидность страхуют effective*-guard'ы ниже.
        setEvents(items);
      })
      .catch(() => {
        // fallback на статичные данные при ошибке сети
      });
  }, []);

  // Dropdown типа: закрываем по клику вне и по Escape, как ожидает обычный popover.
  useEffect(() => {
    if (!typeMenuOpen) return;
    const handlePointer = (e: PointerEvent) => {
      if (typeMenuRef.current && !typeMenuRef.current.contains(e.target as Node)) {
        setTypeMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTypeMenuOpen(false);
        typeTriggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [typeMenuOpen]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const thisMonthKey = useMemo(() => getMonthKey(today), [today]);
  const nextMonthKey = useMemo(
    () => getMonthKey(new Date(today.getFullYear(), today.getMonth() + 1, 1)),
    [today],
  );

  // Фильтруем прошедшие: показываем всё, начиная с понедельника текущей недели —
  // тогда «эта неделя» остаётся целой, а старые месяцы не висят над свежими.
  const upcomingEvents = useMemo(() => {
    const cutoff = getMonday(today);
    return events.filter((e) => getEventDate(e) >= cutoff);
  }, [events, today]);

  // Типы, реально присутствующие в предстоящих событиях — в каноническом порядке.
  const availableTypes = useMemo(() => {
    const present = new Set(
      upcomingEvents.map((e) => e.type).filter((t): t is string => Boolean(t)),
    );
    const ordered = TYPE_ORDER.filter((t) => present.has(t));
    const extras = [...present].filter((t) => !TYPE_ORDER.includes(t)).sort();
    return [...ordered, ...extras];
  }, [upcomingEvents]);

  const hasThisMonth = useMemo(
    () => upcomingEvents.some((e) => getMonthKey(getEventDate(e)) === thisMonthKey),
    [upcomingEvents, thisMonthKey],
  );
  const hasNextMonth = useMemo(
    () => upcomingEvents.some((e) => getMonthKey(getEventDate(e)) === nextMonthKey),
    [upcomingEvents, nextMonthKey],
  );
  const distinctMonths = useMemo(
    () => new Set(upcomingEvents.map((e) => getMonthKey(getEventDate(e)))).size,
    [upcomingEvents],
  );

  // После смены данных выбор мог стать невалидным — мягко чистим (без перетирания пользователя).
  const effectiveTypes = useMemo(
    () => selectedTypes.filter((t) => availableTypes.includes(t)),
    [selectedTypes, availableTypes],
  );
  const effectiveTime: TimeScope | null =
    (timeScope === 'this' && hasThisMonth) || (timeScope === 'next' && hasNextMonth)
      ? timeScope
      : null;

  const filteredEvents = useMemo(
    () =>
      upcomingEvents.filter((event) => {
        if (effectiveTypes.length > 0) {
          if (!event.type || !effectiveTypes.includes(event.type)) return false;
        }
        const monthKey = getMonthKey(getEventDate(event));
        if (effectiveTime === 'this' && monthKey !== thisMonthKey) return false;
        if (effectiveTime === 'next' && monthKey !== nextMonthKey) return false;
        return true;
      }),
    [upcomingEvents, effectiveTypes, effectiveTime, thisMonthKey, nextMonthKey],
  );

  const agenda = useMemo(() => groupByMonth(filteredEvents), [filteredEvents]);

  const showTypeFilter = availableTypes.length >= 2;
  const showTimeFilter = distinctMonths > 1;

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const typeTriggerActive = effectiveTypes.length > 0 || typeMenuOpen;

  const typeFilterAriaLabel =
    effectiveTypes.length === 0
      ? 'Фильтр по типу мероприятия'
      : `Тип: ${effectiveTypes.map(capitalize).join(', ')}`;

  // Toggle-поведение: повторный клик по активной кнопке сбрасывает фильтр времени.
  const toggleTime = (scope: TimeScope) =>
    setTimeScope((prev) => (prev === scope ? null : scope));

  const renderTimeButton = (label: string, active: boolean, onClick: () => void) => (
    <button
      type="button"
      aria-pressed={active}
      className={active ? styles.filterButtonActive : styles.filterButton}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <main id="main" className={styles.root}>
      <h1 className={styles.heading}>Мероприятия</h1>

      {showTimeFilter || showTypeFilter ? (
        <div className={styles.toolbar}>
          {showTimeFilter ? (
            <div className={styles.timeGroup} role="group" aria-label="Когда">
              {hasThisMonth
                ? renderTimeButton('Этот месяц', effectiveTime === 'this', () => toggleTime('this'))
                : null}
              {hasNextMonth
                ? renderTimeButton('Следующий месяц', effectiveTime === 'next', () =>
                    toggleTime('next'),
                  )
                : null}
            </div>
          ) : null}

          {showTypeFilter ? (
            <div className={styles.typeFilter} ref={typeMenuRef}>
              <button
                type="button"
                ref={typeTriggerRef}
                aria-expanded={typeMenuOpen}
                aria-controls={typeMenuId}
                aria-label={typeFilterAriaLabel}
                className={typeTriggerActive ? styles.typeTriggerActive : styles.typeTrigger}
                onClick={() => setTypeMenuOpen((open) => !open)}
              >
                <img src={filtersIcon} alt="" className={styles.typeTriggerIcon} />
                {effectiveTypes.length > 0 ? (
                  <span className={styles.typeTriggerBadge} aria-hidden="true">
                    {effectiveTypes.length}
                  </span>
                ) : null}
              </button>

              {typeMenuOpen ? (
                <div id={typeMenuId} className={styles.typeMenu}>
                  <ul className={styles.typeMenuList}>
                    {availableTypes.map((type) => {
                      const checkboxId = `${typeMenuId}-${type}`;
                      return (
                        <li key={type} className={styles.typeMenuItem}>
                          <Checkbox
                            id={checkboxId}
                            checked={effectiveTypes.includes(type)}
                            onChange={() => toggleType(type)}
                          >
                            {capitalize(type)}
                          </Checkbox>
                        </li>
                      );
                    })}
                  </ul>
                  {effectiveTypes.length > 0 ? (
                    <button
                      type="button"
                      className={styles.typeMenuReset}
                      onClick={() => setSelectedTypes([])}
                    >
                      Сбросить
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <section className={styles.agenda} aria-label="Список мероприятий">
        {agenda.length === 0 ? (
          <p className={styles.empty}>
            {upcomingEvents.length === 0
              ? 'Мероприятий пока нет.'
              : 'Под выбранные фильтры мероприятий нет.'}
          </p>
        ) : (
          agenda.map((monthGroup) => (
            <div key={monthGroup.monthKey} className={styles.monthSection}>
              <h2 className={styles.monthHeading}>{monthGroup.label}</h2>
              <div className={styles.monthEvents}>
                {monthGroup.events.map((event) => (
                  <div key={event.id} className={styles.eventCardWrapper}>
                    <EventCard
                      event={event}
                      onSignup={setSignupEvent}
                      onDetails={setDetailsEvent}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
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

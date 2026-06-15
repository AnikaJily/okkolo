import { Button } from '@/components/ui/Button';
import { ACCESSIBILITY_CONTACTS } from '@/data/accessibility';
import {
  ACCESSIBILITY_HREF,
  CONTACT_EMAIL,
  OKKOLO_ADDRESS,
  OKKOLO_HOURS,
  OKKOLO_MAP_EMBED_URL,
  OKKOLO_MAP_URL,
} from '@/data/site';
import styles from './LocationSection.module.css';

export function LocationSection() {
  return (
    <section
      id="location"
      className={styles.root}
      aria-labelledby="location-heading"
    >
      <div className={styles.content}>
        <header className={styles.head}>
          <h2 id="location-heading" className={styles.heading}>
            Как нас найти
          </h2>
          <p className={styles.lead}>
            Заходите на чашку кофе или на мероприятие — мы на первом этаже,
            пандус есть у входа.
          </p>
        </header>

        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt className={styles.factLabel}>Адрес</dt>
            <dd className={styles.factValue}>
              <a
                href={OKKOLO_MAP_URL}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                {OKKOLO_ADDRESS}
              </a>
            </dd>
          </div>

          <div className={styles.fact}>
            <dt className={styles.factLabel}>Часы работы</dt>
            <dd className={styles.factValue}>
              <ul className={styles.hoursList}>
                {OKKOLO_HOURS.map((slot) => (
                  <li key={slot.days} className={styles.hoursItem}>
                    <span className={styles.hoursDays}>{slot.days}</span>
                    <span className={styles.hoursTime}>{slot.time}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>

          <div className={styles.fact}>
            <dt className={styles.factLabel}>Связь</dt>
            <dd className={styles.factValue}>
              <ul className={styles.contactList}>
                <li>
                  <a
                    href={ACCESSIBILITY_CONTACTS.telegramHref}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                  >
                    Telegram-канал
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`} className={styles.link}>
                    {CONTACT_EMAIL}
                  </a>
                </li>
              </ul>
            </dd>
          </div>
        </dl>

        <div className={styles.cta}>
          <Button variant="primary" size="md" href={OKKOLO_MAP_URL}>
            Открыть в Яндекс Картах
          </Button>
          <Button variant="outline" size="md" href={ACCESSIBILITY_HREF}>
            Подробнее о доступности
          </Button>
        </div>
      </div>

      <div className={styles.mapWrap}>
        <iframe
          src={OKKOLO_MAP_EMBED_URL}
          title={`Карта: ${OKKOLO_ADDRESS}`}
          className={styles.map}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <a
          href={OKKOLO_MAP_URL}
          target="_blank"
          rel="noreferrer"
          className={styles.mapOverlayLink}
          aria-label={`Открыть «${OKKOLO_ADDRESS}» в Яндекс Картах`}
        >
          Открыть карту в Яндекс Картах
        </a>
      </div>
    </section>
  );
}

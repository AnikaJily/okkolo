import { Button } from '@/components/ui/Button';
import { LOCATION_SECTION } from '@/data/location';
import { cn } from '@/lib/utils';
import styles from './LocationSection.module.css';

export interface LocationSectionProps {
  className?: string;
}

export function LocationSection({ className }: LocationSectionProps) {
  const {
    id,
    heading,
    lead,
    addressLabel,
    hoursLabel,
    mapButtonLabel,
    accessibilityButtonLabel,
    address,
    hours,
    mapUrl,
    mapEmbedUrl,
    accessibilityHref,
  } = LOCATION_SECTION;

  return (
    <section
      id={id}
      className={cn(styles.root, className)}
      aria-labelledby="location-heading"
    >
      <div className={styles.content}>
        <header className={`${styles.head} sectionHeadGap`}>
          <h2 id="location-heading" className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.lead}>{lead}</p>
        </header>

        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt className={styles.factLabel}>{addressLabel}</dt>
            <dd className={styles.factValue}>
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                {address}
              </a>
            </dd>
          </div>

          <div className={styles.fact}>
            <dt className={styles.factLabel}>{hoursLabel}</dt>
            <dd className={styles.factValue}>
              <ul className={styles.hoursList}>
                {hours.map((slot) => (
                  <li key={slot.days} className={styles.hoursItem}>
                    <span className={styles.hoursDays}>{slot.days}</span>
                    <span className={styles.hoursTime}>{slot.time}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <div className={styles.cta}>
          <Button variant="primary" size="md" href={mapUrl}>
            {mapButtonLabel}
          </Button>
          <Button variant="outline" size="md" href={accessibilityHref}>
            {accessibilityButtonLabel}
          </Button>
        </div>
      </div>

      <div className={styles.mapWrap}>
        <iframe
          src={mapEmbedUrl}
          title={`Карта: ${address}`}
          className={styles.map}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}

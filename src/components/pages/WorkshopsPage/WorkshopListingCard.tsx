import { Button } from '@/components/ui/Button';
import type { Direction } from '@/data/directions';
import { SUPPORT_HREF } from '@/data/site';
import { safeDomIdFragment } from '@/lib/domId';
import { resolveDirectionHref } from '@/lib/directions';
import styles from './WorkshopListingCard.module.css';

interface WorkshopListingCardProps {
  direction: Direction;
}

const metaItems = (w: NonNullable<Direction['workshop']>) =>
  [
    { term: 'Расписание', def: w.schedule, accent: false },
    { term: 'Формат', def: w.duration, accent: false },
    { term: 'Уровень', def: w.level, accent: false },
    { term: 'Стоимость', def: w.price, accent: true },
    { term: 'Группа', def: w.groupSize, accent: false },
    { term: 'Локация', def: w.locationNote, accent: false },
  ] as const;

export function WorkshopListingCard({ direction }: WorkshopListingCardProps) {
  const w = direction.workshop;
  const detailHref = resolveDirectionHref(direction);
  const bid = `wk-${safeDomIdFragment(direction.id)}`;
  const titleId = `${bid}-title`;

  if (!w) {
    return (
      <article className={styles.article} aria-labelledby={titleId}>
        <div className={styles.media}>
          {direction.image ? (
            <img
              src={direction.image}
              alt=""
              className={styles.image}
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </div>
        <div className={styles.body}>
          <h2 id={titleId} className={styles.title}>
            {direction.title}
          </h2>
          <p className={styles.lead}>{direction.description}</p>
          <nav className={styles.actions} aria-label={`Действия: ${direction.title}`}>
            <Button variant="primary" size="md" href={detailHref} className={styles.actionBtn}>
              Подробнее
            </Button>
            <Button variant="outline" size="md" href={SUPPORT_HREF} className={styles.actionBtn}>
              Записаться и вопросы
            </Button>
          </nav>
        </div>
      </article>
    );
  }

  return (
    <article className={styles.article} aria-labelledby={titleId}>
      <div className={styles.media}>
        {direction.image ? (
          <img
            src={direction.image}
            alt=""
            className={styles.image}
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>

      <div className={styles.body}>
        <div className={styles.metaSection}>
          <dl className={styles.metaList} aria-label="Параметры программы">
            {metaItems(w).map(({ term, def, accent }) => (
              <div
                key={term}
                className={accent ? `${styles.metaItem} ${styles.metaItemAccent}` : styles.metaItem}
              >
                <dt className={styles.metaTerm}>{term}</dt>
                <dd className={styles.metaDef}>{def}</dd>
              </div>
            ))}
          </dl>
        </div>

        <h2 id={titleId} className={styles.title}>
          {direction.title}
        </h2>
        <p className={styles.tagline}>{w.tagline}</p>

        <p className={styles.lead}>{w.lead}</p>

        <div className={styles.section}>
          <h3 id={`${bid}-included`} className={styles.sectionTitle}>
            Что входит
          </h3>
          <ul className={styles.list} aria-labelledby={`${bid}-included`}>
            {w.included.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h3 id={`${bid}-outcome`} className={styles.sectionTitle}>
            Результат
          </h3>
          <p className={styles.outcome}>{w.outcome}</p>
        </div>

        {w.note ? (
          <div className={styles.noteAside} role="note">
            <p className={styles.note}>
              <strong className={styles.noteStrong}>Важно:</strong> {w.note}
            </p>
          </div>
        ) : null}

        {w.host ? <p className={styles.host}>{w.host}</p> : null}

        <nav className={styles.actions} aria-label={`Действия: ${direction.title}`}>
          <Button variant="primary" size="md" href={detailHref} className={styles.actionBtn}>
            Подробнее о направлении
          </Button>
          <Button variant="outline" size="md" href={SUPPORT_HREF} className={styles.actionBtn}>
            Записаться и вопросы
          </Button>
        </nav>
      </div>
    </article>
  );
}

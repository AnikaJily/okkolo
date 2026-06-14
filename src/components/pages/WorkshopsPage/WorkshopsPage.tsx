import { Button } from '@/components/ui/Button';
import {
  ACCESSIBILITY_HREF,
  OKKOLO_ADDRESS,
  OKKOLO_MAP_URL,
} from '@/data/site';
import {
  WORKSHOPS_AFTER_CALLOUTS,
  WORKSHOPS_AFTER_INTRO,
  WORKSHOPS_AUDIENCE,
  WORKSHOPS_AUDIENCE_NOTE,
  WORKSHOPS_INTRO,
  workshopPrograms,
} from '@/data/workshopsPage';
import { WorkshopProgramCard } from './WorkshopProgramCard';
import { WorkshopsSignupSection } from './WorkshopsSignupSection';
import styles from './WorkshopsPage.module.css';

function PhotoPlaceholder() {
  return (
    <div className={styles.photoPlaceholder} aria-hidden="true">
      <span className={styles.photoPlaceholderText}>Фото мастерских (скоро)</span>
    </div>
  );
}

function CalloutCard({ tag, text }: { tag: string; text: string }) {
  return (
    <div className={styles.callout}>
      <span className={styles.calloutTag}>{tag}</span>
      <p className={styles.calloutText}>{text}</p>
    </div>
  );
}

export function WorkshopsPage() {
  return (
    <main id="main" className={styles.root}>
      <section className={styles.hero} aria-labelledby="workshops-page-heading">
        <div className={styles.heroContent}>
          <h1 id="workshops-page-heading" className={styles.heroTitle}>
            Мастерские
          </h1>
          <p className={styles.heroLead}>{WORKSHOPS_INTRO}</p>
          <div className={styles.heroActions}>
            <Button variant="primary" href="#workshops-signup" className={styles.heroPrimaryButton}>
              Записаться
            </Button>
            <Button variant="outline" href="/#about" className={styles.heroOutlineButton}>
              Узнать о проекте
            </Button>
          </div>
        </div>
        <PhotoPlaceholder />
      </section>

      <section className={styles.programs} aria-labelledby="workshops-programs-heading">
        <h2 id="workshops-programs-heading" className={styles.sectionTitle}>
          Чему мы учим
        </h2>
        <ul className={styles.programGrid}>
          {workshopPrograms.map((program) => (
            <li key={program.id}>
              <WorkshopProgramCard program={program} />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.splitSection} aria-labelledby="workshops-audience-heading">
        <div className={styles.splitContent}>
          <h2 id="workshops-audience-heading" className={styles.sectionTitle}>
            Кому подходят мастерские
          </h2>
          <div className={styles.splitText}>
            <p className={styles.bodyText}>{WORKSHOPS_AUDIENCE}</p>
            <CalloutCard tag="Важно" text={WORKSHOPS_AUDIENCE_NOTE} />
          </div>
        </div>
        <PhotoPlaceholder />
      </section>

      <section className={styles.splitSection} aria-labelledby="workshops-after-heading">
        <div className={styles.splitContent}>
          <h2 id="workshops-after-heading" className={styles.sectionTitle}>
            Что будет после обучения
          </h2>
          <div className={styles.splitText}>
            <p className={styles.bodyText}>{WORKSHOPS_AFTER_INTRO}</p>
            {WORKSHOPS_AFTER_CALLOUTS.map((item) => (
              <CalloutCard key={item.text} tag={item.tag} text={item.text} />
            ))}
          </div>
        </div>
        <PhotoPlaceholder />
      </section>

      <WorkshopsSignupSection />

      <section className={styles.location} aria-labelledby="workshops-location-heading">
        <h2 id="workshops-location-heading" className={styles.sectionTitle}>
          Где мы находимся
        </h2>
        <p className={styles.address}>{OKKOLO_ADDRESS}</p>
        <div className={styles.locationActions}>
          <p className={styles.locationNote}>Подробнее о физической доступности</p>
          <Button variant="primary" href={ACCESSIBILITY_HREF} className={styles.locationButton}>
            Доступность
          </Button>
        </div>
        <a href={OKKOLO_MAP_URL} className={styles.mapLink} target="_blank" rel="noopener noreferrer">
          Открыть на карте (2ГИС)
        </a>
      </section>
    </main>
  );
}

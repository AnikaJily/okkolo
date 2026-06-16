import { ABOUT_MISSION, ABOUT_PROBLEMS } from '@/data/about';
import missionPicture from '@/assets/images/why_city_needs_us.jpg?w=480;768;1200&format=avif;webp;jpg&as=picture';
import { Picture } from '@/components/ui/Picture';
import styles from './AboutMissionSection.module.css';

export function AboutMissionSection() {
  return (
    <section className={styles.root} aria-labelledby="about-mission-title">
      <div className={styles.layout}>
        <div className={styles.content}>
          <header className={`${styles.head} sectionHeadGap`}>
            <h2 id="about-mission-title" className={styles.title}>
              Зачем мы нужны городу
            </h2>
            <p className={styles.lead}>{ABOUT_MISSION.context}</p>
          </header>

          <div className={styles.body}>
            <h3 className={styles.problemsTitle}>{ABOUT_MISSION.problemsTitle}</h3>
            <ul className={styles.problemsGrid}>
              {ABOUT_PROBLEMS.map((problem) => (
                <li key={problem.id} className={styles.problemCard}>
                  <p className={styles.problemText}>{problem.text}</p>
                </li>
              ))}
            </ul>

            <div className={styles.callout}>
              <p className={styles.calloutText}>{ABOUT_MISSION.conclusion}</p>
            </div>
          </div>
        </div>

        <figure className={styles.media}>
          <Picture
            picture={missionPicture}
            alt={ABOUT_MISSION.photoAlt}
            className={styles.photo}
            loading="lazy"
            sizes="(min-width: 1024px) 420px, 100vw"
          />
        </figure>
      </div>
    </section>
  );
}

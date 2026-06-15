import { ABOUT_MISSION, ABOUT_PROBLEMS } from '@/data/about';
import styles from './AboutMissionSection.module.css';

export function AboutMissionSection() {
  return (
    <section className={styles.root} aria-labelledby="about-mission-title">
      <header className={`${styles.head} sectionHeadGap`}>
        <h2 id="about-mission-title" className={styles.title}>
          Зачем мы нужны городу
        </h2>
        <p className={styles.lead}>{ABOUT_MISSION.context}</p>
      </header>

      <h3 className={styles.problemsTitle}>{ABOUT_MISSION.problemsTitle}</h3>
      <ul className={styles.problemsGrid}>
        {ABOUT_PROBLEMS.map((problem) => (
          <li key={problem.id} className={styles.problemCard}>
            <span className={styles.problemMarker} aria-hidden="true" />
            <p className={styles.problemText}>{problem.text}</p>
          </li>
        ))}
      </ul>

      <div className={styles.callout}>
        <p className={styles.calloutText}>{ABOUT_MISSION.conclusion}</p>
      </div>
    </section>
  );
}

import { ABOUT_STATS } from '@/data/about';
import styles from './AboutTodaySection.module.css';

export function AboutTodaySection() {
  return (
    <section className={styles.root} aria-labelledby="about-today-title">
      <h2 id="about-today-title" className={styles.title}>
        «Окколо» сегодня
      </h2>
      <ul className={styles.statsBand}>
        {ABOUT_STATS.map((stat) => (
          <li key={stat.id} className={styles.statCard}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

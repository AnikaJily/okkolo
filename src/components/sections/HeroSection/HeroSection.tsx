import heroSrc from '@/assets/images/hero-team.jpg';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.root} aria-label="Команда «Окколо»">
      <img
        src={heroSrc}
        alt="Команда проекта «Окколо»"
        className={styles.image}
        loading="eager"
        decoding="async"
      />
    </section>
  );
}

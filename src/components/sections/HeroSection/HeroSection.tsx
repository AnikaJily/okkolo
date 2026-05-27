import heroPicture from '@/assets/images/hero-team.jpg?w=480;768;1200;1600&format=avif;webp;jpg&as=picture';
import { Picture } from '@/components/ui/Picture';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.root} aria-label="Команда «Окколо»">
      <Picture
        picture={heroPicture}
        alt="Команда проекта «Окколо»"
        className={styles.image}
        loading="eager"
        // @ts-expect-error React typings lag behind the HTML spec
        fetchpriority="high"
        sizes="(min-width: 1024px) 1200px, 100vw"
      />
    </section>
  );
}

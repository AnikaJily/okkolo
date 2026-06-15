import heroPicture from '@/assets/images/hero-team.jpg?w=480;768;1200;1600&format=avif;webp;jpg&as=picture';
import { Button } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import { ABOUT_INTRO } from '@/data/about';
import { getSupportAction } from '@/lib/support';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  onSupport?: () => void;
}

export function HeroSection({ onSupport }: HeroSectionProps) {
  const supportAction = getSupportAction(onSupport);

  return (
    <section id="about" className={styles.root} aria-labelledby="hero-heading">
      <div className={styles.media}>
        <Picture
          picture={heroPicture}
          alt="Команда проекта «Окколо»"
          className={styles.image}
          loading="eager"
          // @ts-expect-error React typings lag behind the HTML spec
          fetchpriority="high"
          sizes="(min-width: 1024px) 632px, 100vw"
        />
      </div>

      <div className={`${styles.content} sectionHeadGap`}>
        <h1 id="hero-heading" className={styles.title}>
          «Окколо» — это инклюзивный социальный проект
        </h1>

        <p className={styles.description}>
          Пространство для работы, творчества и встреч. Кофейня, мастерские и
          возможности для людей с инвалидностью.{' '}
          <span className={styles.taglinePhrase}>{ABOUT_INTRO.tagline}</span>
        </p>

        <div className={styles.ctaBlock}>
          <div className={styles.actions}>
            <Button variant="primary" size="md" {...supportAction}>
              Поддержать проект
            </Button>
            <Button variant="outline" size="md" href="#directions">
              Узнать о проекте
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

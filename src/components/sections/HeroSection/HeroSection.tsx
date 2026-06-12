import heroPicture from '@/assets/images/hero-team.jpg?w=480;768;1200;1600&format=avif;webp;jpg&as=picture';
import { Button } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
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

      <div className={styles.content}>
        <h1 id="hero-heading" className={styles.title}>
          <span className={styles.titleLine}>«Окколо» — это инклюзивный</span>
          <span className={styles.titleLine}>социальный проект</span>
        </h1>

        <p className={styles.description}>
          Пространство для работы, творчества и встреч. Кофейня, мастерские и
          возможности для людей с инвалидностью.
        </p>

        <div className={styles.actions}>
          <Button
            variant="primary"
            className={styles.primaryButton}
            {...supportAction}
          >
            Поддержать проект
          </Button>
          <Button
            variant="outline"
            className={styles.outlineButton}
            href="#directions"
          >
            Узнать о проекте
          </Button>
        </div>
      </div>
    </section>
  );
}

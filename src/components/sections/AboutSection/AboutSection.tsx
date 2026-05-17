import { Button } from '@/components/ui/Button';
import { getSupportAction } from '@/lib/support';
import styles from './AboutSection.module.css';

interface AboutSectionProps {
  onSupport?: () => void;
}

export function AboutSection({ onSupport }: AboutSectionProps) {
  const supportAction = getSupportAction(onSupport);

  return (
    <section id="about" className={styles.root} aria-labelledby="about-heading">
      <div className={styles.highlight}>
        <h2 id="about-heading" className={styles.highlightText}>
          «Окколо» — это инклюзивный
          <br />
          социальный проект
        </h2>
      </div>

      <p className={styles.description}>
        Пространство для работы, творчества и встреч. Кофейня, мастерские и
        возможности для людей с инвалидностью.
      </p>

      <div className={styles.actions}>
        <Button variant="primary" {...supportAction}>
          Поддержать проект
        </Button>
        <Button variant="outline" href="#directions">
          Узнать о проекте
        </Button>
      </div>
    </section>
  );
}

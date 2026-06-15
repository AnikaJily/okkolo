import { Button } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import type { WorkshopProgram } from '@/data/workshopsPage';
import styles from './WorkshopProgramCard.module.css';

interface WorkshopProgramCardProps {
  program: WorkshopProgram;
}

export function WorkshopProgramCard({ program }: WorkshopProgramCardProps) {
  return (
    <article className={styles.card} aria-labelledby={`program-${program.id}-title`}>
      <div className={styles.media}>
        {program.picture ? (
          <Picture
            picture={program.picture}
            alt=""
            className={styles.image}
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        ) : program.image ? (
          <img
            src={program.image}
            alt=""
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>

      <div className={styles.body}>
        <div className={styles.text}>
          <h3 id={`program-${program.id}-title`} className={styles.title}>
            {program.title}
          </h3>
          <p className={styles.description}>{program.description}</p>
        </div>

        <Button
          variant="primary"
          size="md"
          href="#workshops-signup"
          className={styles.action}
          fullWidth
        >
          Записаться
        </Button>
      </div>
    </article>
  );
}

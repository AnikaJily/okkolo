import { Button } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import type { PictureSource } from '@/components/ui/Picture';
import styles from './WorkshopProgramCard.module.css';

export interface WorkshopProgramCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  picture?: PictureSource;
  imageAlt?: string;
  showAction?: boolean;
  actionLabel?: string;
  actionHref?: string;
}

export function WorkshopProgramCard({
  id,
  title,
  description,
  image,
  picture,
  imageAlt = '',
  showAction = true,
  actionLabel = 'Записаться',
  actionHref = '#workshops-signup',
}: WorkshopProgramCardProps) {
  return (
    <article className={styles.card} aria-labelledby={`program-${id}-title`}>
      <div className={styles.media}>
        {picture ? (
          <Picture
            picture={picture}
            alt={imageAlt}
            className={styles.image}
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        ) : image ? (
          <img
            src={image}
            alt={imageAlt}
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>

      <div className={styles.body}>
        <div className={styles.text}>
          <h3 id={`program-${id}-title`} className={styles.title}>
            {title}
          </h3>
          <p className={styles.description}>{description}</p>
        </div>

        {showAction ? (
          <Button
            variant="primary"
            size="md"
            href={actionHref}
            className={styles.action}
            fullWidth
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </article>
  );
}

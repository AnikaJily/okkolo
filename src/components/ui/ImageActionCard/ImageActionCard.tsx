import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import styles from './ImageActionCard.module.css';

type ImageActionCardVariant = 'overlay' | 'preview';

interface ImageActionCardProps {
  variant: ImageActionCardVariant;
  title: string;
  description: string;
  image: string;
  href: string;
  actionLabel: string;
  action?: () => void;
  secondaryActionLabel?: string;
  secondaryHref?: string;
  secondaryAction?: () => void;
  imageAlt?: string;
  meta?: string;
  className?: string;
  descriptionClassName?: string;
  extraContent?: ReactNode;
}

export function ImageActionCard({
  variant,
  title,
  description,
  image,
  href,
  actionLabel,
  action,
  secondaryActionLabel,
  secondaryHref,
  secondaryAction,
  imageAlt = '',
  meta,
  className,
  descriptionClassName,
  extraContent,
}: ImageActionCardProps) {
  if (variant === 'overlay') {
    return (
      <article className={cn(styles.overlayCard, className)}>
        <img
          src={image}
          alt={imageAlt}
          className={styles.overlayImage}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.overlayGradient} aria-hidden="true" />

        <div className={styles.overlayContent}>
          <div className={styles.overlayText}>
            <h3 className={styles.overlayTitle}>{title}</h3>
            <p className={styles.overlayDescription}>{description}</p>
          </div>

          {action ? (
            <Button variant="primary" size="sm" fullWidth onClick={action}>
              {actionLabel}
            </Button>
          ) : (
            <Button variant="primary" size="sm" fullWidth href={href}>
              {actionLabel}
            </Button>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className={cn(styles.previewCard, className)}>
      <div className={styles.previewImageWrap}>
        <img
          src={image}
          alt={imageAlt}
          className={styles.previewImage}
          loading="lazy"
          decoding="async"
        />
        {meta ? (
          <span className={styles.previewMeta} aria-hidden="true">
            {meta}
          </span>
        ) : null}
      </div>

      <div className={styles.previewBody}>
        <div className={styles.previewText}>
          <h3 className={styles.previewTitle}>{title}</h3>
          <p
            className={cn(
              'font-medium text-[var(--color-text-subtle)]',
              descriptionClassName ??
                'text-[length:var(--text-caption)] leading-[var(--leading-tight)]',
            )}
          >
            {description}
          </p>
        </div>

        <div className={styles.previewActions}>
          {action ? (
            <Button variant="primary" size="sm" fullWidth className="min-w-0 max-w-full" onClick={action}>
              {actionLabel}
            </Button>
          ) : (
            <Button variant="primary" size="sm" fullWidth className="min-w-0 max-w-full" href={href}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel ? (
            secondaryAction ? (
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="min-w-0 max-w-full"
                onClick={secondaryAction}
              >
                {secondaryActionLabel}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="min-w-0 max-w-full"
                href={secondaryHref ?? href}
              >
                {secondaryActionLabel}
              </Button>
            )
          ) : null}
        </div>
        {extraContent ? <div className={styles.previewExtra}>{extraContent}</div> : null}
      </div>
    </article>
  );
}

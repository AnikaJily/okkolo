import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Picture, type PictureSource } from '@/components/ui/Picture';
import { cn } from '@/lib/utils';
import styles from './ImageActionCard.module.css';

type ImageActionCardVariant = 'overlay' | 'preview';

interface ImageActionCardProps {
  variant: ImageActionCardVariant;
  /** Вариант основной кнопки: primary (заливка) или outline (обводка) */
  actionVariant?: 'primary' | 'outline';
  title: string;
  description: string;
  image: string;
  picture?: PictureSource;
  imageSizes?: string;
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
  actionsLayout?: 'column' | 'row';
}

export function ImageActionCard({
  variant,
  actionVariant = 'primary',
  title,
  description,
  image,
  picture,
  imageSizes,
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
  actionsLayout = 'column',
}: ImageActionCardProps) {
  const overlayMedia = picture ? (
    <Picture
      picture={picture}
      alt={imageAlt}
      className={styles.overlayImage}
      sizes={imageSizes}
    />
  ) : (
    <img
      src={image}
      alt={imageAlt}
      className={styles.overlayImage}
      loading="lazy"
      decoding="async"
    />
  );

  const previewMedia = picture ? (
    <Picture
      picture={picture}
      alt={imageAlt}
      className={styles.previewImage}
      sizes={imageSizes}
    />
  ) : (
    <img
      src={image}
      alt={imageAlt}
      className={styles.previewImage}
      loading="lazy"
      decoding="async"
    />
  );

  if (variant === 'overlay') {
    return (
      <article className={cn(styles.overlayCard, className)}>
        {overlayMedia}
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
      <div className={styles.previewImageWrap}>{previewMedia}</div>

      <div className={styles.previewBody}>
        {meta ? <span className={styles.previewMeta}>{meta}</span> : null}

        <div className={styles.previewText}>
          <h3 className={styles.previewTitle}>{title}</h3>
          <p
            className={cn(
              'font-medium text-[var(--color-text-secondary)]',
              descriptionClassName ??
                'text-[length:var(--text-body)] leading-normal',
            )}
          >
            {description}
          </p>
        </div>

        <div
          className={cn(
            styles.previewActions,
            actionsLayout === 'row' && styles.previewActionsRow,
          )}
        >
          {action ? (
            <Button variant={actionVariant} size="md" fullWidth className="min-w-0 max-w-full" onClick={action}>
              {actionLabel}
            </Button>
          ) : (
            <Button variant={actionVariant} size="md" fullWidth className="min-w-0 max-w-full" href={href}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel ? (
            secondaryAction ? (
              <Button
                variant="outline"
                size="md"
                fullWidth
                className="min-w-0 max-w-full"
                onClick={secondaryAction}
              >
                {secondaryActionLabel}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="md"
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

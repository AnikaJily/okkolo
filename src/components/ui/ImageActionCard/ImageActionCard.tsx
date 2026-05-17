import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type ImageActionCardVariant = 'overlay' | 'preview';

interface ImageActionCardProps {
  variant: ImageActionCardVariant;
  title: string;
  description: string;
  image: string;
  href: string;
  actionLabel: string;
  imageAlt?: string;
  meta?: string;
  className?: string;
}

export function ImageActionCard({
  variant,
  title,
  description,
  image,
  href,
  actionLabel,
  imageAlt = '',
  meta,
  className,
}: ImageActionCardProps) {
  if (variant === 'overlay') {
    return (
      <article
        className={cn(
          'group relative flex aspect-[275/424] min-h-[380px] w-full overflow-hidden rounded-[35px] bg-black shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card-hover)]',
          className,
        )}
      >
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div
          className="absolute inset-x-0 bottom-0 min-h-[48%] rounded-[35px] bg-[image:var(--gradient-image-overlay)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mt-auto flex w-full flex-col justify-end gap-5 p-[15px]">
          <div className="flex max-w-[220px] flex-col gap-2.5 text-white">
            <h3 className="font-display text-[length:var(--text-feature-title)] font-semibold leading-[1.1] text-balance">
              {title}
            </h3>
            <p className="font-display text-[length:var(--text-body)] font-medium leading-[1.25] text-white/95">
              {description}
            </p>
          </div>

          <Button variant="primary" size="sm" fullWidth href={href}>
            {actionLabel}
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[10px] bg-[var(--color-surface)] pb-2.5 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]',
        className,
      )}
    >
      <div className="relative flex h-[217px] shrink-0 flex-col justify-end overflow-hidden p-2.5">
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {meta ? (
          <span
            className="relative z-10 inline-flex w-fit items-end justify-center rounded-xl bg-[var(--color-surface)] px-2.5 py-[5px] font-display text-[length:var(--text-caption)] font-medium leading-none text-[var(--color-text)] shadow-[var(--shadow-card)]"
            aria-hidden="true"
          >
            {meta}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col items-start gap-[21px] px-2.5 pt-[15px]">
        <div className="flex min-w-0 flex-col gap-[13px] font-display leading-[1.3]">
          <h3 className="max-w-full truncate text-[length:var(--text-card-title)] font-medium text-[var(--color-text)]">
            {title}
          </h3>
          <p className="text-[length:var(--text-caption)] font-medium text-[var(--color-text-subtle)]">
            {description}
          </p>
        </div>

        <Button variant="primary" size="sm" fullWidth href={href}>
          {actionLabel}
        </Button>
      </div>
    </article>
  );
}

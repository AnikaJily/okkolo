import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/Button';
import type { OkkoloEvent } from '@/data/events';
import styles from './EventDetailsModal.module.css';

interface EventDetailsModalProps {
  event: OkkoloEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignup?: (event: OkkoloEvent) => void;
}

export function EventDetailsModal({
  event,
  open,
  onOpenChange,
  onSignup,
}: EventDetailsModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          {event ? (
            <article className={styles.card}>
              <button
                type="button"
                className={styles.close}
                onClick={() => onOpenChange(false)}
                aria-label="Закрыть"
              >
                ×
              </button>

              <div className={styles.imagePane}>
                <img
                  src={event.image}
                  alt={event.title}
                  className={styles.image}
                  decoding="async"
                />
                <span className={styles.meta}>{event.dateLabel}</span>
              </div>

              <div className={styles.detailsPane}>
                <div className={styles.summary}>
                  <Dialog.Title className={styles.heading}>{event.title}</Dialog.Title>
                  <Dialog.Description className={styles.admission}>
                    {event.admission}
                  </Dialog.Description>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    if (!event) return;
                    onOpenChange(false);
                    onSignup?.(event);
                  }}
                >
                  Записаться
                </Button>

                {event.description ? (
                  <p className={styles.description}>{event.description}</p>
                ) : null}
              </div>
            </article>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

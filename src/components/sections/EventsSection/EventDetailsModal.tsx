import * as Dialog from '@radix-ui/react-dialog';
import { DetailCard } from '@/components/ui/DetailCard';
import { Picture } from '@/components/ui/Picture';
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
            <DetailCard
              media={
                event.picture ? (
                  <Picture
                    picture={event.picture}
                    alt={event.title}
                    className={styles.image}
                    sizes="(min-width: 1024px) 450px, 100vw"
                  />
                ) : (
                  <img
                    src={event.image}
                    alt={event.title}
                    className={styles.image}
                    loading="lazy"
                    decoding="async"
                  />
                )
              }
              tag={event.dateLabel}
              title={<Dialog.Title>{event.title}</Dialog.Title>}
              bottomLabel={<Dialog.Description>{event.admission}</Dialog.Description>}
              description={event.description}
              primaryActionLabel="Записаться"
              onPrimaryAction={() => {
                onOpenChange(false);
                onSignup?.(event);
              }}
              onClose={() => onOpenChange(false)}
            />
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

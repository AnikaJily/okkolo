import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import type { OkkoloEvent } from '@/data/events';
import { createEventRegistration } from '@/lib/strapi';
import styles from './EventSignupModal.module.css';

interface EventSignupModalProps {
  event: OkkoloEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export function EventSignupModal({ event, open, onOpenChange }: EventSignupModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [demoPaymentComplete, setDemoPaymentComplete] = useState(false);
  const isPaidEvent = Boolean(event?.isPaid);

  useEffect(() => {
    if (!open) {
      setName('');
      setPhone('');
      setEmail('');
      setComment('');
      setSubmitStatus('idle');
      setDemoPaymentComplete(false);
    }
  }, [open, event?.id]);

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!event || submitStatus === 'submitting') return;

    setSubmitStatus('submitting');

    try {
      await createEventRegistration({
        eventId: event.id,
        eventTitle: event.title,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        comment: comment.trim() || undefined,
        paymentStatus: isPaidEvent ? 'pending' : undefined,
      });
      setSubmitStatus('success');
      setName('');
      setPhone('');
      setEmail('');
      setComment('');
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          {event ? (
            <>
              <button
                type="button"
                className={styles.close}
                onClick={() => onOpenChange(false)}
                aria-label="Закрыть"
              >
                ×
              </button>

              <div className={styles.summary}>
                <span className={styles.tag}>{event.dateLabel}</span>
                <Dialog.Title className={styles.heading}>Записаться</Dialog.Title>
                <Dialog.Description className={styles.eventTitle}>
                  {event.title}
                </Dialog.Description>
                {event.isPaid && event.price ? (
                  <p className={styles.price}>
                    Цена: {priceFormatter.format(event.price)}
                  </p>
                ) : null}
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  <span className={styles.label}>Имя</span>
                  <input
                    className={styles.input}
                    value={name}
                    onChange={(changeEvent) => setName(changeEvent.target.value)}
                    required
                    autoComplete="name"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Телефон</span>
                  <input
                    className={styles.input}
                    value={phone}
                    onChange={(changeEvent) => setPhone(changeEvent.target.value)}
                    required
                    type="tel"
                    autoComplete="tel"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Email, если удобно</span>
                  <input
                    className={styles.input}
                    value={email}
                    onChange={(changeEvent) => setEmail(changeEvent.target.value)}
                    type="email"
                    autoComplete="email"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Комментарий</span>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    value={comment}
                    onChange={(changeEvent) => setComment(changeEvent.target.value)}
                    rows={3}
                  />
                </label>

                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  type="submit"
                  disabled={submitStatus === 'submitting' || submitStatus === 'success'}
                >
                  {submitStatus === 'submitting'
                    ? 'Отправляем...'
                    : submitStatus === 'success'
                    ? 'Заявка отправлена'
                    : 'Отправить заявку'}
                </Button>

                {/* Контейнеры статусов существуют в DOM заранее (SC 4.1.3) — паттерн WorkshopsPage */}
                <div className={styles.successBlock} role="status">
                  {submitStatus === 'success' ? (
                    <>
                      <p className={styles.success}>
                        {demoPaymentComplete
                          ? 'Демо-оплата прошла. В реальной версии здесь заявка подтвердится после оплаты.'
                          : isPaidEvent
                          ? 'Спасибо, мы получили вашу заявку. Она будет подтверждена после оплаты.'
                          : 'Спасибо, мы получили вашу заявку.'}
                      </p>
                      {isPaidEvent && event.paymentUrl ? (
                        <Button
                          variant="outline"
                          size="md"
                          fullWidth
                          href={event.paymentUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Перейти к оплате
                        </Button>
                      ) : null}
                      {isPaidEvent && !event.paymentUrl && !demoPaymentComplete ? (
                        <Button
                          variant="outline"
                          size="md"
                          fullWidth
                          type="button"
                          onClick={() => setDemoPaymentComplete(true)}
                        >
                          Демо-оплата 0 ₽
                        </Button>
                      ) : null}
                    </>
                  ) : null}
                </div>

                <p className={styles.error} role="alert">
                  {submitStatus === 'error'
                    ? 'Не получилось отправить заявку. Попробуйте еще раз.'
                    : ''}
                </p>
              </form>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

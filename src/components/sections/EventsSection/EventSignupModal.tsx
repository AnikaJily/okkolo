import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
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
  const fieldIdPrefix = useId();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [demoPaymentComplete, setDemoPaymentComplete] = useState(false);
  const isPaidEvent = Boolean(event?.isPaid);

  useEffect(() => {
    if (!open) {
      setName('');
      setPhone('');
      setEmail('');
      setComment('');
      setConsent(false);
      setConsentError(false);
      setSubmitStatus('idle');
      setDemoPaymentComplete(false);
    }
  }, [open, event?.id]);

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!event || submitStatus === 'submitting') return;

    if (!consent) {
      setConsentError(true);
      return;
    }

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
      setConsent(false);
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
                <Dialog.Title className={styles.heading}>Регистрация</Dialog.Title>
                <Dialog.Description className={styles.eventTitle} asChild>
                  <h3>{event.title}</h3>
                </Dialog.Description>
                {event.isPaid && event.price ? (
                  <p className={styles.price}>
                    Цена: {priceFormatter.format(event.price)}
                  </p>
                ) : null}
              </div>

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.field}>
                  <label htmlFor={`${fieldIdPrefix}-name`} className={styles.label}>
                    Имя*
                  </label>
                  <input
                    id={`${fieldIdPrefix}-name`}
                    className={styles.input}
                    value={name}
                    onChange={(changeEvent) => setName(changeEvent.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor={`${fieldIdPrefix}-phone`} className={styles.label}>
                    Телефон*
                  </label>
                  <input
                    id={`${fieldIdPrefix}-phone`}
                    className={styles.input}
                    value={phone}
                    onChange={(changeEvent) => setPhone(changeEvent.target.value)}
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor={`${fieldIdPrefix}-email`} className={styles.label}>
                    Email, если удобно
                  </label>
                  <input
                    id={`${fieldIdPrefix}-email`}
                    className={styles.input}
                    value={email}
                    onChange={(changeEvent) => setEmail(changeEvent.target.value)}
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor={`${fieldIdPrefix}-comment`} className={styles.label}>
                    Комментарий
                  </label>
                  <textarea
                    id={`${fieldIdPrefix}-comment`}
                    className={`${styles.input} ${styles.textarea}`}
                    value={comment}
                    onChange={(changeEvent) => setComment(changeEvent.target.value)}
                    rows={3}
                  />
                </div>

                <Checkbox
                  id={`${fieldIdPrefix}-consent`}
                  checked={consent}
                  error={consentError}
                  onChange={(changeEvent) => {
                    setConsent(changeEvent.target.checked);
                    if (changeEvent.target.checked) {
                      setConsentError(false);
                    }
                  }}
                  required
                >
                  Согласие на обработку персональных данных
                </Checkbox>

                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  type="submit"
                  className={styles.submitButton}
                  disabled={submitStatus === 'submitting' || submitStatus === 'success'}
                >
                  {submitStatus === 'submitting'
                    ? 'Отправляем…'
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

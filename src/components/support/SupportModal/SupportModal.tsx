import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { CloseIcon } from '@/components/ui/CloseIcon/CloseIcon';
import { FilterChip } from '@/components/ui/FilterChip';
import { RequiredMark } from '@/components/ui/RequiredMark';
import {
  SUPPORT_AMOUNTS,
  SUPPORT_AMOUNT_MAX,
  SUPPORT_AMOUNT_MIN,
  SUPPORT_FREQUENCIES,
  SUPPORT_INTRO,
  SUPPORT_PAYMENT_PENDING,
} from '@/data/support';
import type { SupportFrequencyValue } from '@/data/support';
import { cn } from '@/lib/utils';
import styles from './SupportModal.module.css';

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// idle — форма; submitting — короткий переход; ready — «до оплаты» (см. SUPPORT_PAYMENT_PENDING)
type Status = 'idle' | 'submitting' | 'ready';

const DEFAULT_PRESET = SUPPORT_AMOUNTS[1] ?? SUPPORT_AMOUNTS[0] ?? null;

const amountFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());

/** Разбирает произвольный ввод суммы: оставляем только цифры. */
function parseAmount(raw: string): number | null {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;
  const value = Number.parseInt(digits, 10);
  return Number.isFinite(value) ? value : null;
}

export function SupportModal({ open, onOpenChange }: SupportModalProps) {
  const fieldId = useId();
  const customAmountRef = useRef<HTMLInputElement>(null);
  const readyTimerRef = useRef<number | null>(null);

  const [frequency, setFrequency] = useState<SupportFrequencyValue>('once');
  const [preset, setPreset] = useState<number | null>(DEFAULT_PRESET);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [status, setStatus] = useState<Status>('idle');

  // Эффективная сумма: выбранный пресет либо распарсенный произвольный ввод.
  const amount = preset ?? parseAmount(customAmount);
  const amountValid =
    amount != null && amount >= SUPPORT_AMOUNT_MIN && amount <= SUPPORT_AMOUNT_MAX;
  const formattedAmount = amount != null ? amountFormatter.format(amount) : null;

  // Сброс при закрытии — как в EventSignupModal (модалка живёт всё время).
  useEffect(() => {
    if (!open) {
      if (readyTimerRef.current) {
        clearTimeout(readyTimerRef.current);
        readyTimerRef.current = null;
      }
      setFrequency('once');
      setPreset(DEFAULT_PRESET);
      setCustomAmount('');
      setName('');
      setEmail('');
      setConsent(false);
      setAmountError(false);
      setEmailError(false);
      setConsentError(false);
      setStatus('idle');
    }
  }, [open]);

  const selectPreset = (value: number) => {
    setPreset(value);
    setCustomAmount('');
    setAmountError(false);
  };

  const handleCustomChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(event.target.value);
    setPreset(null);
    if (amountError) setAmountError(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== 'idle') return;

    if (!amountValid) {
      setAmountError(true);
      setPreset(null);
      customAmountRef.current?.focus();
      return;
    }
    if (!isEmail(email)) {
      setEmailError(true);
      document.getElementById(`${fieldId}-email`)?.focus();
      return;
    }
    if (!consent) {
      setConsentError(true);
      document.getElementById(`${fieldId}-consent`)?.focus();
      return;
    }

    // Здесь начинается оплата. Платёжная система пока не подключена (MVP) —
    // имитируем переход и показываем статус «до оплаты».
    setStatus('submitting');
    readyTimerRef.current = window.setTimeout(() => setStatus('ready'), 700);
  };

  const submitLabel =
    status === 'submitting'
      ? 'Готовим оплату…'
      : status === 'ready'
        ? 'Переход к оплате готов'
        : formattedAmount
          ? `Перейти к оплате · ${formattedAmount}${frequency === 'monthly' ? ' / мес' : ''}`
          : 'Перейти к оплате';

  const readyMessage =
    status === 'ready' && formattedAmount
      ? `${
          frequency === 'monthly' ? 'Готовим ежемесячное пожертвование' : 'Готовим пожертвование'
        } на ${formattedAmount}. ${SUPPORT_PAYMENT_PENDING}`
      : '';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-describedby={undefined}>
          <button
            type="button"
            className={styles.close}
            onClick={() => onOpenChange(false)}
            aria-label="Закрыть"
          >
            <CloseIcon size="dialog" />
          </button>

          <div className={styles.summary}>
            <span className={styles.tag}>Пожертвование</span>
            <Dialog.Title className={styles.heading}>Поддержать проект</Dialog.Title>
            <p className={styles.intro}>{SUPPORT_INTRO}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.group} role="group" aria-labelledby={`${fieldId}-freq-label`}>
              <span id={`${fieldId}-freq-label`} className={styles.groupLabel}>
                Как часто
              </span>
              <div className={styles.segment}>
                {SUPPORT_FREQUENCIES.map((option) => (
                  <FilterChip
                    key={option.value}
                    active={frequency === option.value}
                    aria-pressed={frequency === option.value}
                    onClick={() => setFrequency(option.value)}
                  >
                    {option.label}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div className={styles.group} role="group" aria-labelledby={`${fieldId}-amount-label`}>
              <span id={`${fieldId}-amount-label`} className={styles.groupLabel}>
                Сумма
                <RequiredMark />
              </span>
              <div className={styles.amountGrid}>
                {SUPPORT_AMOUNTS.map((value) => (
                  <FilterChip
                    key={value}
                    active={preset === value}
                    aria-pressed={preset === value}
                    onClick={() => selectPreset(value)}
                  >
                    {amountFormatter.format(value)}
                  </FilterChip>
                ))}
              </div>

              <div className={styles.customField}>
                <label htmlFor={`${fieldId}-amount`} className={styles.srLabel}>
                  Другая сумма в рублях
                </label>
                <input
                  ref={customAmountRef}
                  id={`${fieldId}-amount`}
                  className={cn(styles.input, styles.amountInput, amountError && styles.inputError)}
                  value={customAmount}
                  onChange={handleCustomChange}
                  inputMode="numeric"
                  placeholder="Другая сумма"
                  aria-invalid={amountError || undefined}
                  aria-describedby={amountError ? `${fieldId}-amount-error` : undefined}
                />
                <span className={styles.currency} aria-hidden="true">
                  ₽
                </span>
              </div>

              {amountError ? (
                <p id={`${fieldId}-amount-error`} className={styles.error}>
                  {`Укажите сумму от ${amountFormatter.format(
                    SUPPORT_AMOUNT_MIN,
                  )} до ${amountFormatter.format(SUPPORT_AMOUNT_MAX)}`}
                </p>
              ) : null}
            </div>

            <div className={styles.field}>
              <label htmlFor={`${fieldId}-name`} className={styles.label}>
                Имя
              </label>
              <input
                id={`${fieldId}-name`}
                className={styles.input}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="Как к вам обращаться"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${fieldId}-email`} className={styles.label}>
                Email
                <RequiredMark />
              </label>
              <input
                id={`${fieldId}-email`}
                className={cn(styles.input, emailError && styles.inputError)}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (emailError) setEmailError(false);
                }}
                type="email"
                autoComplete="email"
                required
                placeholder="Пришлём квитанцию"
                aria-invalid={emailError || undefined}
                aria-describedby={emailError ? `${fieldId}-email-error` : undefined}
              />
              {emailError ? (
                <p id={`${fieldId}-email-error`} className={styles.error}>
                  Введите корректный email — на него придёт квитанция
                </p>
              ) : null}
            </div>

            <Checkbox
              id={`${fieldId}-consent`}
              checked={consent}
              error={consentError}
              errorMessage="Подтвердите согласие на обработку персональных данных"
              onChange={(event) => {
                setConsent(event.target.checked);
                if (event.target.checked) setConsentError(false);
              }}
              required
            >
              Согласие на обработку{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noreferrer"
                className="consentLink"
                onClick={(event) => event.stopPropagation()}
              >
                персональных данных
              </a>
            </Checkbox>

            <Button
              variant="primary"
              size="md"
              fullWidth
              type="submit"
              className={styles.submitButton}
              disabled={status !== 'idle'}
            >
              {submitLabel}
            </Button>

            {/* Статус смонтирован заранее (SC 4.1.3) — как .statusSuccess в форме записи */}
            <p className={styles.success} role="status">
              {readyMessage}
            </p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

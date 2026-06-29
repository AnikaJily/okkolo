import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { RequiredMark } from '@/components/ui/RequiredMark';
import { Radio } from '@/components/ui/Radio';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HOURS,
  CONTACT_PHONE_PLACEHOLDER,
  SUPPORT_HREF,
} from '@/data/site';
import { createWorkshopApplication } from '@/lib/strapi';
import styles from './WorkshopsSignupSection.module.css';

type ContactMethod = 'phone' | 'email';
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 12;
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function WorkshopsSignupSection() {
  const [name, setName] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('phone');
  const [contactValue, setContactValue] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const [consentError, setConsentError] = useState(false);
  // Фидбэк копирования — меняем надпись самой нажатой кнопки (key — какой канал).
  const [copyFeedback, setCopyFeedback] = useState<{ key: ContactMethod; ok: boolean } | null>(
    null,
  );
  const copyTimer = useRef<number | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  const handleCopy = async (value: string, key: ContactMethod) => {
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    try {
      await copyToClipboard(value);
      setCopyFeedback({ key, ok: true });
    } catch {
      setCopyFeedback({ key, ok: false });
    }
    // Возвращаем надпись кнопки к «Скопировать» через паузу.
    copyTimer.current = window.setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleContactMethodChange = (method: ContactMethod) => {
    setContactMethod(method);
    setContactValue('');
    setErrors((prev) => ({ ...prev, contact: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitStatus === 'submitting') return;

    // Собираем все ошибки сразу, фокус — на первую в порядке DOM (имя → контакт → согласие)
    const nextErrors: { name?: string; contact?: string } = {};
    if (!name.trim()) {
      nextErrors.name = 'Напишите, как вас зовут';
    }
    if (!contactValue.trim()) {
      nextErrors.contact =
        contactMethod === 'phone'
          ? 'Введите номер телефона'
          : 'Введите адрес электронной почты';
    } else if (contactMethod === 'phone' && !isValidPhone(contactValue)) {
      nextErrors.contact = 'Введите номер телефона, например +7 918 123-45-67';
    } else if (contactMethod === 'email' && !contactValue.includes('@')) {
      nextErrors.contact = 'Введите адрес электронной почты';
    }
    setErrors(nextErrors);
    const consentMissing = !consent;
    setConsentError(consentMissing);

    if (nextErrors.name) {
      nameRef.current?.focus();
      return;
    }
    if (nextErrors.contact) {
      contactRef.current?.focus();
      return;
    }
    if (consentMissing) {
      document.getElementById('workshops-signup-consent')?.focus();
      return;
    }

    setSubmitStatus('submitting');
    try {
      await createWorkshopApplication({
        name: name.trim(),
        contactMethod,
        phone: contactMethod === 'phone' ? contactValue.trim() : undefined,
        email: contactMethod === 'email' ? contactValue.trim() : undefined,
      });
      setSubmitStatus('success');
      setName('');
      setContactValue('');
      setConsent(false);
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    }
  };

  const isSubmitting = submitStatus === 'submitting';
  const isPhoneContact = contactMethod === 'phone';
  const contactPlaceholder = isPhoneContact ? '+7 918 123-45-67' : 'hello@example.com';

  const phoneDisplay = CONTACT_PHONE_DISPLAY || CONTACT_PHONE_PLACEHOLDER;

  // Надпись кнопки копирования: «Скопировано» / «Не удалось» — только на той,
  // что нажали; остальные остаются «Скопировать».
  const copyButtonLabel = (key: ContactMethod) =>
    copyFeedback?.key === key ? (copyFeedback.ok ? 'Скопировано' : 'Не удалось') : 'Скопировать';

  // Текст для скринридера (смена надписи кнопки сама по себе озвучивается ненадёжно).
  const copyAnnouncement = copyFeedback
    ? copyFeedback.ok
      ? copyFeedback.key === 'phone'
        ? 'Номер телефона скопирован'
        : 'Адрес почты скопирован'
      : 'Не удалось скопировать'
    : '';

  return (
    <section
      id="workshops-signup"
      className={styles.root}
      aria-labelledby="workshops-signup-heading"
    >
      <h2 id="workshops-signup-heading" className={styles.heading}>
        Как записаться
      </h2>

      <div className={styles.panel}>
        <div className={styles.direct}>
          <div className={styles.directMain}>
            <div className={styles.directIntro}>
              <h3 className={styles.directTitle}>Можно связаться напрямую</h3>
              <p className={styles.directLead}>Выберите удобный способ</p>
            </div>

            <div className={styles.channels}>
              <div className={styles.channel}>
                <div className={styles.channelInfo}>
                  <p className={styles.channelLabel}>Позвонить</p>
                  {CONTACT_PHONE ? (
                    <a href={`tel:${CONTACT_PHONE}`} className={styles.channelValue}>
                      {phoneDisplay}
                    </a>
                  ) : (
                    <span className={styles.channelValue}>{phoneDisplay}</span>
                  )}
                  <div className={styles.channelMeta}>
                    {CONTACT_PHONE_HOURS.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="md"
                  className={styles.copyButton}
                  onClick={() => handleCopy(phoneDisplay, 'phone')}
                >
                  {copyButtonLabel('phone')}
                </Button>
              </div>

              <div className={styles.channel}>
                <div className={styles.channelInfo}>
                  <p className={styles.channelLabel}>Написать на почту</p>
                  <a href={SUPPORT_HREF} className={styles.channelValue}>
                    {CONTACT_EMAIL}
                  </a>
                  <p className={styles.channelMetaSingle}>Пишите в любое время</p>
                </div>
                <Button
                  variant="outline"
                  size="md"
                  className={styles.copyButton}
                  onClick={() => handleCopy(CONTACT_EMAIL, 'email')}
                >
                  {copyButtonLabel('email')}
                </Button>
              </div>
            </div>
          </div>

          <p className={styles.directNote}>
            Неудобно звонить или не дозвонились? Оставьте заявку, мы перезвоним или напишем.
          </p>

          {/* Видимый фидбэк — на самой кнопке; здесь только озвучка для скринридера.
              Смонтирован всегда (live-region должен существовать до смены текста). */}
          <p className="visually-hidden" role="status" aria-live="polite">
            {copyAnnouncement}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.formIntro}>
            <h3 className={styles.formTitle}>Или оставить заявку</h3>
            <p className={styles.formLead}>Заполните форму и мы свяжемся, как вам удобно.</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="workshops-signup-name" className={styles.fieldLabel}>
              Имя
              <RequiredMark />
            </label>
            <input
              id="workshops-signup-name"
              ref={nameRef}
              className={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'workshops-signup-name-error' : undefined}
            />
            {errors.name ? (
              <p id="workshops-signup-name-error" className={styles.fieldError}>
                {errors.name}
              </p>
            ) : null}
          </div>

          <fieldset className={styles.radioGroup}>
            <legend className={`${styles.fieldLabel} ${styles.fieldLabelStrong}`}>
              Как с вами связаться?
              <RequiredMark />
            </legend>
            <div className={styles.radioOptions}>
              <Radio
                id="workshops-signup-contact-phone"
                name="contact-method"
                value="phone"
                checked={isPhoneContact}
                onChange={() => handleContactMethodChange('phone')}
              >
                Позвонить
              </Radio>
              <Radio
                id="workshops-signup-contact-email"
                name="contact-method"
                value="email"
                checked={!isPhoneContact}
                onChange={() => handleContactMethodChange('email')}
              >
                Написать
              </Radio>
            </div>
          </fieldset>

          <div className={styles.field}>
            <label htmlFor="workshops-signup-contact" className={styles.fieldLabel}>
              {isPhoneContact ? 'Телефон' : 'Почта'}
              <RequiredMark />
            </label>
            <input
              id="workshops-signup-contact"
              key={contactMethod}
              ref={contactRef}
              className={styles.input}
              value={contactValue}
              onChange={(event) => setContactValue(event.target.value)}
              required
              type={isPhoneContact ? 'tel' : 'email'}
              inputMode={isPhoneContact ? 'tel' : 'email'}
              autoComplete={isPhoneContact ? 'tel' : 'email'}
              placeholder={contactPlaceholder}
              aria-invalid={errors.contact ? true : undefined}
              aria-describedby={
                errors.contact ? 'workshops-signup-contact-error' : undefined
              }
            />
            {errors.contact ? (
              <p id="workshops-signup-contact-error" className={styles.fieldError}>
                {errors.contact}
              </p>
            ) : null}
          </div>

          <Checkbox
            id="workshops-signup-consent"
            checked={consent}
            error={consentError}
            errorMessage="Подтвердите согласие на обработку персональных данных"
            onChange={(event) => {
              setConsent(event.target.checked);
              if (event.target.checked) {
                setConsentError(false);
              }
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
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            className={styles.submitButton}
            aria-disabled={isSubmitting || undefined}
          >
            {isSubmitting ? 'Отправляем…' : 'Отправить заявку'}
          </Button>

          <p className={styles.statusSuccess} role="status">
            {submitStatus === 'success'
              ? 'Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время'
              : ''}
          </p>
          <p className={styles.statusError} role="alert">
            {submitStatus === 'error'
              ? `Не получилось отправить заявку. Попробуйте еще раз${
                  CONTACT_PHONE_DISPLAY
                    ? ` — или позвоните нам: ${CONTACT_PHONE_DISPLAY}`
                    : ''
                }`
              : ''}
          </p>
        </form>
      </div>
    </section>
  );
}

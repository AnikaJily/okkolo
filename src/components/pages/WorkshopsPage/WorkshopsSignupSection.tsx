import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HOURS,
  CONTACT_PHONE_PLACEHOLDER,
  SUPPORT_HREF,
} from '@/data/site';
import { createEventRegistration } from '@/lib/strapi';
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
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  const handleCopy = async (value: string, label: string) => {
    try {
      await copyToClipboard(value);
      setCopyStatus(`${label} скопирован`);
      window.setTimeout(() => setCopyStatus(null), 2500);
    } catch {
      setCopyStatus('Не удалось скопировать');
      window.setTimeout(() => setCopyStatus(null), 2500);
    }
  };

  const handleContactMethodChange = (method: ContactMethod) => {
    setContactMethod(method);
    setContactValue('');
    setErrors((prev) => ({ ...prev, contact: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitStatus === 'submitting') return;

    if (!consent) {
      setConsentError(true);
      return;
    }

    const nextErrors: { name?: string; contact?: string } = {};
    if (!name.trim()) {
      nextErrors.name = 'Напишите, как вас зовут.';
    }
    if (!contactValue.trim()) {
      nextErrors.contact =
        contactMethod === 'phone'
          ? 'Введите номер телефона.'
          : 'Введите адрес электронной почты.';
    } else if (contactMethod === 'phone' && !isValidPhone(contactValue)) {
      nextErrors.contact = 'Введите номер телефона, например +7 918 123-45-67.';
    } else if (contactMethod === 'email' && !contactValue.includes('@')) {
      nextErrors.contact = 'Введите адрес электронной почты.';
    }
    setErrors(nextErrors);

    if (nextErrors.name) {
      nameRef.current?.focus();
      return;
    }
    if (nextErrors.contact) {
      contactRef.current?.focus();
      return;
    }

    setSubmitStatus('submitting');
    try {
      await createEventRegistration({
        eventId: 'workshops-callback',
        eventTitle: 'Мастерские: заявка на обратный звонок',
        name: name.trim(),
        phone: contactMethod === 'phone' ? contactValue.trim() : '',
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
  const contactLabel = isPhoneContact ? 'Телефон*' : 'Почта*';
  const contactPlaceholder = isPhoneContact ? '+7 918 123-45-67' : 'hello@example.com';

  const phoneDisplay = CONTACT_PHONE_DISPLAY || CONTACT_PHONE_PLACEHOLDER;

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
              <div className={styles.channelText}>
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
                type="button"
                variant="outline"
                fullWidth
                className={styles.copyButton}
                onClick={() => handleCopy(phoneDisplay, 'Номер')}
              >
                Скопировать
              </Button>
            </div>

            <div className={styles.channel}>
              <div className={styles.channelText}>
                <p className={styles.channelLabel}>Написать на почту</p>
                <a href={SUPPORT_HREF} className={styles.channelValue}>
                  {CONTACT_EMAIL}
                </a>
                <p className={styles.channelMetaSingle}>Пишите в любое время</p>
              </div>
              <Button
                type="button"
                variant="outline"
                fullWidth
                className={styles.copyButton}
                onClick={() => handleCopy(CONTACT_EMAIL, 'Почта')}
              >
                Скопировать
              </Button>
            </div>
          </div>
          </div>

          <p className={styles.directNote}>
            Неудобно звонить или не дозвонились? Оставьте заявку, мы перезвоним или напишем.
          </p>

          {copyStatus ? (
            <p className={styles.copyStatus} role="status" aria-live="polite">
              {copyStatus}
            </p>
          ) : null}
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.formIntro}>
            <h3 className={styles.formTitle}>Или оставить заявку</h3>
            <p className={styles.formLead}>Заполните форму и мы свяжемся, как вам удобно.</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="workshops-signup-name" className={styles.fieldLabel}>
              Имя*
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
              Как с вами связаться?*
            </legend>
            <div className={styles.radioOptions}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="contact-method"
                  value="phone"
                  checked={isPhoneContact}
                  onChange={() => handleContactMethodChange('phone')}
                />
                <span>Позвонить</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="contact-method"
                  value="email"
                  checked={!isPhoneContact}
                  onChange={() => handleContactMethodChange('email')}
                />
                <span>Написать</span>
              </label>
            </div>
          </fieldset>

          <div className={styles.field}>
            <label htmlFor="workshops-signup-contact" className={styles.fieldLabel}>
              {contactLabel}
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
            onChange={(event) => {
              setConsent(event.target.checked);
              if (event.target.checked) {
                setConsentError(false);
              }
            }}
            required
          >
            Согласие на обработку персональных данных
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
              ? 'Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.'
              : ''}
          </p>
          <p className={styles.statusError} role="alert">
            {submitStatus === 'error'
              ? `Не получилось отправить заявку. Попробуйте еще раз${
                  CONTACT_PHONE_DISPLAY
                    ? ` — или позвоните нам: ${CONTACT_PHONE_DISPLAY}`
                    : ''
                }.`
              : ''}
          </p>
        </form>
      </div>
    </section>
  );
}

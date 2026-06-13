import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { workshops } from '@/data/workshops';
import {
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  OKKOLO_ADDRESS,
  OKKOLO_MAP_URL,
} from '@/data/site';
import { createEventRegistration } from '@/lib/strapi';
import styles from './WorkshopsPage.module.css';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

/** Принимаем телефон в любой привычной записи: +7, скобки, пробелы, дефисы */
function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 12;
}

export function WorkshopsPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (submitStatus === 'submitting') return;

    const nextErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) {
      nextErrors.name = 'Напишите, как вас зовут.';
    }
    if (!isValidPhone(phone)) {
      nextErrors.phone = 'Введите номер телефона, например +7 918 123-45-67.';
    }
    setErrors(nextErrors);

    // Фокус — на первое поле с ошибкой (SC 3.3.1)
    if (nextErrors.name) {
      nameRef.current?.focus();
      return;
    }
    if (nextErrors.phone) {
      phoneRef.current?.focus();
      return;
    }

    setSubmitStatus('submitting');
    try {
      // MVP: заявка уходит в существующую коллекцию заявок Strapi,
      // чтобы попадать в ту же админку, что и записи на мероприятия.
      await createEventRegistration({
        eventId: 'workshops-callback',
        eventTitle: 'Мастерские: заявка на обратный звонок',
        name: name.trim(),
        phone: phone.trim(),
      });
      setSubmitStatus('success');
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    }
  };

  const isSubmitting = submitStatus === 'submitting';

  return (
    <main id="main" className={styles.root}>
      <section className={styles.intro} aria-labelledby="workshops-heading">
        <div className={styles.introText}>
          <h1 id="workshops-heading" className={styles.pageHeading}>
            Мастерские
          </h1>
          <p className={styles.bodyText}>
            В мастерских «Окколо» мы учим профессии: шить на производственных
            станках, работать бариста, делать звук и свет на мероприятиях.
            После обучения помогаем со стажировкой и трудоустройством.
            Мастерские — для молодых людей с инвалидностью.
          </p>
          <p className={styles.bodyText}>
            Чтобы записаться, позвоните нам или оставьте телефон — мы
            перезвоним.{' '}
            <a href="#signup" className={styles.anchorLink}>
              Перейти к записи
            </a>
          </p>
        </div>
        <div className={styles.introMedia}>
          <span className={styles.placeholderLabel}>Фото мастерских — скоро</span>
        </div>
      </section>

      <section aria-labelledby="programs-heading" className={styles.section}>
        <h2 id="programs-heading" className={styles.sectionHeading}>
          Чему мы учим
        </h2>
        <ul className={styles.workshopList}>
          {workshops.map((workshop) => (
            <li key={workshop.id} className={styles.workshopItem}>
              <article
                className={styles.workshopCard}
                aria-labelledby={`workshop-${workshop.id}`}
              >
                <div className={styles.workshopPhoto}>
                  <span className={styles.placeholderLabel}>
                    {workshop.photoLabel} — скоро
                  </span>
                </div>

                <div className={styles.workshopBody}>
                  <h3
                    id={`workshop-${workshop.id}`}
                    className={styles.workshopTitle}
                  >
                    {workshop.title}
                  </h3>
                  <p className={styles.workshopLead}>{workshop.lead}</p>
                  {workshop.teacher ? (
                    <p className={styles.workshopMeta}>{workshop.teacher}</p>
                  ) : null}
                  <p className={styles.workshopMeta}>
                    <strong className={styles.workshopMetaStrong}>
                      Что дальше:{' '}
                    </strong>
                    {workshop.after}
                  </p>

                  <div className={styles.workshopAction}>
                    <Button variant="outline" size="md" fullWidth href="#signup">
                      Записаться: {workshop.title.toLowerCase()}
                    </Button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="fit-heading" className={styles.section}>
        <h2 id="fit-heading" className={styles.sectionHeading}>
          Кому подходят мастерские
        </h2>
        <div className={styles.split}>
          <p className={styles.bodyText}>
            Мы ждём молодых людей с инвалидностью: глухих и слабослышащих,
            незрячих и слабовидящих, тех, кто передвигается на коляске или
            пользуется протезами. Специальная подготовка не нужна — учим с
            нуля.
          </p>
          <div role="note" className={styles.noteCard}>
            <span className={styles.noteTag}>Важно знать</span>
            <p className={styles.noteText}>
              О чём говорим честно: мы не работаем с ментальными особенностями.
              Для такого обучения нужны профильные специалисты, а их в нашей
              команде пока нет.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="space-heading" className={styles.section}>
        <h2 id="space-heading" className={styles.sectionHeading}>
          Как у нас устроено пространство
        </h2>
        <div className={`${styles.split} ${styles.splitMediaLeft}`}>
          <ul className={styles.spaceList}>
            <li>
              Пространство находится на первом этаже и приспособлено для
              передвижения на коляске.
            </li>
            <li>
              В кофейне кластера работают глухие бариста — мы умеем общаться
              без слов.
            </li>
          </ul>
          <div className={styles.spaceMedia}>
            <span className={styles.placeholderLabel}>
              Фото бариста за стойкой — скоро
            </span>
          </div>
        </div>
      </section>

      <section aria-labelledby="after-heading" className={styles.section}>
        <h2 id="after-heading" className={styles.sectionHeading}>
          Что будет после обучения
        </h2>
        <div className={styles.split}>
          <p className={styles.bodyText}>
            Мастерские — это не кружок по интересам. Наша цель — чтобы вы
            получили профессию и работу. После обучения мы помогаем со
            стажировкой и трудоустройством.
          </p>
          <p className={styles.factCard}>
            Выпускники кофейного направления уже работают бариста в кофейне
            «Окколо».
          </p>
        </div>
      </section>

      <section
        id="signup"
        aria-labelledby="signup-heading"
        className={styles.section}
      >
        <h2 id="signup-heading" className={styles.sectionHeading}>
          Как записаться
        </h2>

        <div className={styles.signupCard}>
          <div className={styles.signupInvite}>
            <p className={styles.signupLead}>
              Позвоните нам — или оставьте телефон, и мы перезвоним сами.
            </p>
            <p className={styles.bodyTextSecondary}>
              Расскажем про мастерские, ответим на вопросы и поможем выбрать
              направление. Заявка ни к чему не обязывает.
            </p>
            {CONTACT_PHONE ? (
              <div className={styles.callPath}>
                <Button variant="primary" size="lg" href={`tel:${CONTACT_PHONE}`}>
                  Позвонить: {CONTACT_PHONE_DISPLAY}
                </Button>
              </div>
            ) : null}
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="signup-name" className={styles.label}>
                Имя (обязательно)
              </label>
              <input
                id="signup-name"
                ref={nameRef}
                className={styles.input}
                value={name}
                onChange={(changeEvent) => setName(changeEvent.target.value)}
                autoComplete="name"
                required
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? 'signup-name-error' : undefined}
              />
              {errors.name ? (
                <p id="signup-name-error" className={styles.fieldError}>
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className={styles.field}>
              <label htmlFor="signup-phone" className={styles.label}>
                Телефон (обязательно)
              </label>
              <input
                id="signup-phone"
                ref={phoneRef}
                className={styles.input}
                value={phone}
                onChange={(changeEvent) => setPhone(changeEvent.target.value)}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={
                  errors.phone
                    ? 'signup-phone-error signup-phone-hint'
                    : 'signup-phone-hint'
                }
              />
              <p id="signup-phone-hint" className={styles.fieldHint}>
                Например: +7 918 123-45-67
              </p>
              {errors.phone ? (
                <p id="signup-phone-error" className={styles.fieldError}>
                  {errors.phone}
                </p>
              ) : null}
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              type="submit"
              aria-disabled={isSubmitting || undefined}
            >
              {isSubmitting ? 'Отправляем…' : 'Отправить заявку — мы перезвоним'}
            </Button>

            {/* Контейнеры статусов существуют в DOM заранее (SC 4.1.3) */}
            <p className={styles.statusSuccess} role="status">
              {submitStatus === 'success'
                ? 'Спасибо! Заявка отправлена. Мы перезвоним вам в ближайшее время.'
                : ''}
            </p>
            <p className={styles.statusError} role="alert">
              {submitStatus === 'error'
                ? `Не получилось отправить заявку. Попробуйте ещё раз${
                    CONTACT_PHONE_DISPLAY
                      ? ` — или позвоните нам: ${CONTACT_PHONE_DISPLAY}`
                      : ''
                  }.`
                : ''}
            </p>
          </form>
        </div>
      </section>

      <section aria-labelledby="address-heading" className={styles.section}>
        <h2 id="address-heading" className={styles.sectionHeading}>
          Где мы находимся
        </h2>
        <div className={styles.addressRow}>
          <p className={styles.addressText}>{OKKOLO_ADDRESS}</p>
          <Button
            variant="outline"
            size="md"
            href={OKKOLO_MAP_URL}
            target="_blank"
            rel="noreferrer"
          >
            Открыть на карте (2ГИС)
          </Button>
          {CONTACT_PHONE ? (
            <Button variant="primary" size="md" href={`tel:${CONTACT_PHONE}`}>
              Позвонить: {CONTACT_PHONE_DISPLAY}
            </Button>
          ) : null}
        </div>
      </section>
    </main>
  );
}

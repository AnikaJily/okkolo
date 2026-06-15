import { useEffect, useState } from 'react';
import {
  ACCESSIBILITY_CONTACTS,
  ACCESSIBILITY_FACTS,
  ACCESSIBILITY_UPDATED,
} from '@/data/accessibility';
import { ImageActionCard } from '@/components/ui/ImageActionCard';
import {
  accessibilityPageFromFallback,
  loadAccessibilityPage,
  type AccessibilityPageView,
} from '@/lib/accessibilityPage';
import styles from './AccessibilityPage.module.css';

function PhotoPlaceholder({ label = 'Фото пространства (скоро)' }: { label?: string }) {
  return (
    <div className={styles.photoPlaceholder} aria-hidden="true">
      <span className={styles.photoPlaceholderText}>{label}</span>
    </div>
  );
}

function SectionPhoto({ photo }: { photo: AccessibilityPageView }) {
  if (photo.heroImageUrl) {
    return (
      <img
        src={photo.heroImageUrl}
        alt={photo.heroImageAlt}
        className={styles.sectionImage}
        loading="lazy"
        decoding="async"
      />
    );
  }
  return <PhotoPlaceholder />;
}

export function AccessibilityPage() {
  const [page, setPage] = useState<AccessibilityPageView>(accessibilityPageFromFallback);

  useEffect(() => {
    let cancelled = false;
    loadAccessibilityPage().then((data) => {
      if (!cancelled) setPage(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main id="main" className={styles.root}>
      <div className={styles.heroRow}>
        <section className={styles.facts} aria-labelledby="facts-heading">
          <header className={`${styles.factsHead} sectionHeadGap`}>
            <h2 id="facts-heading" className={styles.sectionTitle}>
              {page.title}
            </h2>
            {page.lead ? <p className={styles.leadText}>{page.lead}</p> : null}
          </header>
          <h3 className={styles.subsectionTitle}>Коротко о главном</h3>
          <ul className={styles.factsGrid}>
            {ACCESSIBILITY_FACTS.map((fact) => (
              <li key={fact.id} className={styles.factItem}>
                <ImageActionCard
                  variant="content"
                  title={fact.title}
                  description={fact.text}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className={styles.splitSection} aria-labelledby="inside-heading">
        <div className={`${styles.splitContent} sectionHeadGap`}>
          <h2 id="inside-heading" className={styles.sectionTitle}>
            Вход и пространство внутри
          </h2>
          <div className={styles.splitText}>
            <p className={styles.bodyText}>
              Вход с улицы оборудован пандусом, все пространство расположено
              на первом этаже. Внутри на одном уровне находятся кофейня,
              шоурум и мастерские; санузел адаптирован для посетителей на
              коляске.
            </p>
            <p className={styles.bodyText}>
              Точные замеры (уклон пандуса, ширину дверей и проходов) опубликуем
              после аудита пространства. Если эти параметры важны для визита
              уже сейчас, напишите нам, уточним и ответим.
            </p>
          </div>
        </div>
        <SectionPhoto photo={page} />
      </section>

      <section className={`${styles.simpleSection} sectionHeadGap`} aria-labelledby="guide-dogs-heading">
        <h2 id="guide-dogs-heading" className={styles.sectionTitle}>
          Собаки-проводники
        </h2>
        <p className={styles.bodyText}>
          С собакой-проводником к нам можно: это право закреплено законом
          (ст. 15 ФЗ-181), и мы о нем знаем. Миску с водой попросите
          у администратора.
        </p>
      </section>

      <section className={`${styles.simpleSection} sectionHeadGap`} aria-labelledby="deaf-heading">
        <h2 id="deaf-heading" className={styles.sectionTitle}>
          Глухим и слабослышащим посетителям
        </h2>
        <p className={styles.bodyText}>
          В нашей команде работают глухие бариста, поэтому общение без звука
          для нас привычно: заказать кофе можно письменно или жестами. Запись
          на события тоже не требует звонка, используйте форму на сайте или
          мессенджеры.
        </p>
      </section>

      <section className={`${styles.simpleSection} sectionHeadGap`} aria-labelledby="blind-heading">
        <h2 id="blind-heading" className={styles.sectionTitle}>
          Незрячим и слабовидящим посетителям
        </h2>
        <p className={styles.bodyText}>
          Напишите нам заранее, встретим у входа и поможем сориентироваться.
          Бариста с удовольствием прочитают меню вслух, а на сайте есть{' '}
          <a className={styles.inlineLink} href="/cafe">
            текстовая версия меню кофейни
          </a>{' '}
          (она удобна для скринридеров).
        </p>
      </section>

      <section className={`${styles.simpleSection} sectionHeadGap`} aria-labelledby="site-a11y-heading">
        <h2 id="site-a11y-heading" className={styles.sectionTitle}>
          Доступность этого сайта
        </h2>
        <p className={styles.bodyText}>
          Мы хотим, чтобы сайтом «Окколо» могли пользоваться все, в том числе
          люди, которые работают со скринридером, навигацией с клавиатуры или
          увеличенным шрифтом. Мы ориентируемся на рекомендации WCAG 2.1
          уровня AA; сайт соответствует им частично, и мы продолжаем его
          улучшать.
        </p>
        <p className={styles.bodyText}>
          Что уже сделано: логичная структура заголовков, текстовая версия
          меню кофейни, уменьшение анимаций для тех, у кого включена настройка
          «меньше движения». Известные ограничения: не у всех фотографий есть
          развернутые описания, контраст части элементов мы еще проверяем.
        </p>
        <p className={styles.bodyText}>
          Нашли барьер на сайте? Напишите на{' '}
          <a className={styles.inlineLink} href={ACCESSIBILITY_CONTACTS.emailHref}>
            {ACCESSIBILITY_CONTACTS.email}
          </a>
          : укажите страницу и что не получилось, постараемся ответить в
          течение недели.
        </p>
      </section>

      <div className={styles.updatedWrap}>
        <p className={styles.updated}>Страница обновлена: {ACCESSIBILITY_UPDATED}</p>
      </div>
    </main>
  );
}

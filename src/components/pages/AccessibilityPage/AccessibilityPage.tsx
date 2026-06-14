import {
  ACCESSIBILITY_CONTACTS,
  ACCESSIBILITY_FACTS,
  ACCESSIBILITY_TRANSPORT,
  ACCESSIBILITY_UPDATED,
} from '@/data/accessibility';
import { OKKOLO_ADDRESS, OKKOLO_MAP_URL } from '@/data/site';
import styles from './AccessibilityPage.module.css';

function PhotoPlaceholder() {
  return (
    <div className={styles.photoPlaceholder} aria-hidden="true">
      <span className={styles.photoPlaceholderText}>Фото пространства (скоро)</span>
    </div>
  );
}

export function AccessibilityPage() {
  return (
    <main id="main" className={styles.root}>
      <div className={styles.heroRow}>

        <section className={styles.facts} aria-labelledby="facts-heading">
          <h2 id="facts-heading" className={styles.sectionTitle}>
            Доступность
          </h2>
          <h3 className="_formTitle_13xlw_89">
            Коротко о главном
          </h3>
          <ul className={styles.factsGrid}>
            {ACCESSIBILITY_FACTS.map((fact) => (
              <li key={fact.id} className={styles.factCard}>
                <h3 className={styles.factTitle}>{fact.title}</h3>
                <p className={styles.factText}>{fact.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className={styles.simpleSection} aria-labelledby="contact-heading">
        <h2 id="contact-heading" className={styles.sectionTitle}>
          Напишите нам перед визитом
        </h2>
        <div className={styles.contactCard}>
          <p className={styles.bodyText}>
            Если у вас есть вопросы о доступности или нужна помощь на месте,
            напишите нам. Звонить не обязательно: мы спокойно отвечаем
            письменно.
          </p>
          <ul className={styles.contactList}>
            <li>
              <a className={styles.contactLink} href={ACCESSIBILITY_CONTACTS.telegramHref}>
                Telegram
              </a>
            </li>
            {ACCESSIBILITY_CONTACTS.whatsappHref ? (
              <li>
                <a className={styles.contactLink} href={ACCESSIBILITY_CONTACTS.whatsappHref}>
                  WhatsApp
                </a>
              </li>
            ) : null}
            <li>
              <a className={styles.contactLink} href={ACCESSIBILITY_CONTACTS.emailHref}>
                {ACCESSIBILITY_CONTACTS.email}
              </a>
            </li>
            {ACCESSIBILITY_CONTACTS.phoneHref ? (
              <li>
                <a className={styles.contactLink} href={ACCESSIBILITY_CONTACTS.phoneHref}>
                  {ACCESSIBILITY_CONTACTS.phone}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </section>

      <section className={styles.splitSection} aria-labelledby="route-heading">
        <div className={styles.splitContent}>
          <h2 id="route-heading" className={styles.sectionTitle}>
            Как добраться
          </h2>
          <div className={styles.splitText}>
            <p className={styles.bodyText}>
              Мы находимся по адресу {OKKOLO_ADDRESS}, первый этаж (
              <a
                className={styles.inlineLink}
                href={OKKOLO_MAP_URL}
                target="_blank"
                rel="noreferrer"
              >
                посмотреть на карте
              </a>
              ). Ближайшая остановка — «{ACCESSIBILITY_TRANSPORT.stop}»,{' '}
              {ACCESSIBILITY_TRANSPORT.trams}.
            </p>
            <p className={styles.bodyText}>
              Подробное описание пути от остановки до двери мы сейчас готовим.
              Пока его нет, напишите нам: расскажем маршрут словами и, если
              нужно, встретим у входа.
            </p>
          </div>
        </div>
        <PhotoPlaceholder />
      </section>

      <section className={styles.splitSection} aria-labelledby="inside-heading">
        <div className={styles.splitContent}>
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
        <PhotoPlaceholder />
      </section>

      <section className={styles.simpleSection} aria-labelledby="guide-dogs-heading">
        <h2 id="guide-dogs-heading" className={styles.sectionTitle}>
          Собаки-проводники
        </h2>
        <p className={styles.bodyText}>
          С собакой-проводником к нам можно: это право закреплено законом
          (ст. 15 ФЗ-181), и мы о нем знаем. Миску с водой попросите
          у администратора.
        </p>
      </section>

      <section className={styles.simpleSection} aria-labelledby="deaf-heading">
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

      <section className={styles.simpleSection} aria-labelledby="blind-heading">
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

      <section className={styles.simpleSection} aria-labelledby="site-a11y-heading">
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

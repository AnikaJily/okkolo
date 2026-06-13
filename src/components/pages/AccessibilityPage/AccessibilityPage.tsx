import {
  ACCESSIBILITY_CONTACTS,
  ACCESSIBILITY_FACTS,
  ACCESSIBILITY_TRANSPORT,
  ACCESSIBILITY_UPDATED,
} from '@/data/accessibility';
import { OKKOLO_ADDRESS, OKKOLO_MAP_URL } from '@/data/site';
import styles from './AccessibilityPage.module.css';

export function AccessibilityPage() {
  return (
    <main id="main" className={styles.root}>
      <section className={styles.intro} aria-labelledby="accessibility-heading">
        <h1 id="accessibility-heading" className={styles.heading}>
          Доступность
        </h1>
        <div className={styles.lead}>
          <p>
            «Окколо» — инклюзивное пространство: у нас работают люди с
            инвалидностью, и мы хотим, чтобы каждому посетителю было заранее
            понятно, как устроен визит.
          </p>
          <p>
            На этой странице — честное описание того, что уже доступно, и
            контакт, по которому можно уточнить всё остальное. Если вы нашли
            барьер, о котором мы не знаем, — напишите, это помогает нам
            становиться лучше.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="facts-heading">
        <h2 id="facts-heading" className={styles.sectionHeading}>
          Коротко о главном
        </h2>
        <ul className={styles.factsGrid}>
          {ACCESSIBILITY_FACTS.map((fact) => (
            <li key={fact.id} className={styles.factCard}>
              <h3 className={styles.factTitle}>{fact.title}</h3>
              <p className={styles.factText}>{fact.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="contact-heading">
        <h2 id="contact-heading" className={styles.sectionHeading}>
          Напишите нам перед визитом
        </h2>
        <div className={styles.contactCard}>
          <p className={styles.sectionText}>
            Если у вас есть вопросы о доступности или нужна помощь на месте —
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

      <section className={styles.section} aria-labelledby="route-heading">
        <h2 id="route-heading" className={styles.sectionHeading}>
          Как добраться
        </h2>
        <div className={styles.sectionBody}>
          <p className={styles.sectionText}>
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
          <p className={styles.sectionText}>
            Подробное описание пути от остановки до двери мы сейчас готовим.
            Пока его нет — напишите нам, расскажем маршрут словами и, если
            нужно, встретим у входа.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="inside-heading">
        <h2 id="inside-heading" className={styles.sectionHeading}>
          Вход и пространство внутри
        </h2>
        <div className={styles.sectionBody}>
          <p className={styles.sectionText}>
            Вход с улицы оборудован пандусом, всё пространство — на первом
            этаже. Внутри на одном уровне расположены кофейня, шоурум и
            мастерские; санузел адаптирован для посетителей на коляске.
          </p>
          <p className={styles.sectionText}>
            Точные замеры — уклон пандуса, ширину дверей и проходов — мы
            опубликуем после аудита пространства. Если эти параметры важны для
            вашего визита уже сейчас, напишите нам — уточним и ответим.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="guide-dogs-heading">
        <h2 id="guide-dogs-heading" className={styles.sectionHeading}>
          Собаки-проводники
        </h2>
        <p className={styles.sectionText}>
          С собакой-проводником к нам можно — это право закреплено законом
          (ст. 15 ФЗ-181), и мы о нём знаем. Миску с водой попросите у
          администратора.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="deaf-heading">
        <h2 id="deaf-heading" className={styles.sectionHeading}>
          Глухим и слабослышащим посетителям
        </h2>
        <p className={styles.sectionText}>
          В нашей команде работают глухие бариста, поэтому общение без звука для
          нас — обычное дело: заказать кофе можно письменно или жестами. Запись
          на события тоже не требует звонка — используйте форму на сайте или
          мессенджеры.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="blind-heading">
        <h2 id="blind-heading" className={styles.sectionHeading}>
          Незрячим и слабовидящим посетителям
        </h2>
        <div className={styles.sectionBody}>
          <p className={styles.sectionText}>
            Напишите нам заранее — встретим у входа и поможем
            сориентироваться. Бариста с удовольствием прочитают меню вслух, а на
            сайте есть{' '}
            <a className={styles.inlineLink} href="/cafe">
              текстовая версия меню кофейни
            </a>{' '}
            — она удобна для скринридеров.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="events-heading">
        <h2 id="events-heading" className={styles.sectionHeading}>
          События и мастер-классы
        </h2>
        <p className={styles.sectionText}>
          Записаться на любое событие можно через форму на сайте — без звонков.
          В форме есть поле для комментария: напишите там о своих потребностях
          (например, «приду на коляске» или «нужно общаться письменно»), и мы
          подготовимся к вашему визиту.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="site-a11y-heading">
        <h2 id="site-a11y-heading" className={styles.sectionHeading}>
          Доступность этого сайта
        </h2>
        <div className={styles.sectionBody}>
          <p className={styles.sectionText}>
            Мы хотим, чтобы сайтом «Окколо» могли пользоваться все, в том числе
            люди, которые работают со скринридером, навигацией с клавиатуры или
            увеличенным шрифтом. Мы ориентируемся на рекомендации WCAG 2.1
            уровня AA; сайт соответствует им частично, и мы продолжаем его
            улучшать.
          </p>
          <p className={styles.sectionText}>
            Что уже сделано: логичная структура заголовков, текстовая версия
            меню кофейни, уменьшение анимаций для тех, у кого включена
            настройка «меньше движения». Известные ограничения: не у всех
            фотографий есть развёрнутые описания, контраст части элементов мы
            ещё проверяем.
          </p>
          <p className={styles.sectionText}>
            Нашли барьер на сайте? Напишите на{' '}
            <a className={styles.inlineLink} href={ACCESSIBILITY_CONTACTS.emailHref}>
              {ACCESSIBILITY_CONTACTS.email}
            </a>
            : укажите страницу и что не получилось — постараемся ответить в
            течение недели.
          </p>
        </div>
      </section>

      <p className={styles.updated}>Страница обновлена: {ACCESSIBILITY_UPDATED}</p>
    </main>
  );
}

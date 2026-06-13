import { Picture } from '@/components/ui/Picture';
import { cafeMenus } from '@/data/cafe';
import styles from './CafePage.module.css';

const GALLERY_PLACEHOLDERS = ['Фото интерьера', 'Фото бара', 'Фото зала'];

export function CafePage() {
  return (
    <main id="main" className={styles.root}>
      <section className={styles.intro} aria-labelledby="cafe-heading">
        <h1 id="cafe-heading" className={styles.heading}>
          Кофейня
        </h1>
        <div className={styles.lead}>
          <p>
            Кофейня — сердце «Окколо». За стойкой работают бариста с
            инвалидностью: они прошли обучение здесь же, в кластере, и варят
            кофе наравне с любой городской кофейней — от классики до авторских
            напитков.
          </p>
          <p>
            Каждый купленный стакан помогает проекту жить: выручка кофейни идёт
            на обучение и трудоустройство новых ребят. Зайдите на чашку — это и
            есть самый простой способ нас поддержать.
          </p>
        </div>
      </section>

      <section className={styles.menus} aria-label="Меню кофейни">
        {cafeMenus.map((menu) => (
          <figure key={menu.id} className={styles.menuFigure}>
            <Picture
              picture={menu.picture}
              alt={menu.alt}
              className={styles.menuImage}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <figcaption className={styles.menuCaption}>{menu.title}</figcaption>

            <details className={styles.menuText}>
              <summary className={styles.menuTextSummary}>
                {menu.title} текстом
              </summary>

              {menu.sections.map((section) => (
                <div key={section.title} className={styles.menuSection}>
                  <h3 className={styles.menuSectionTitle}>{section.title}</h3>
                  <ul className={styles.menuList}>
                    {section.items.map((item) => (
                      <li key={item.name} className={styles.menuItem}>
                        <span className={styles.menuItemName}>
                          {item.name}
                          {item.volume ? (
                            <span className={styles.menuItemVolume}> {item.volume}</span>
                          ) : null}
                          {item.note ? (
                            <span className={styles.menuItemNote}> — {item.note}</span>
                          ) : null}
                        </span>
                        <span className={styles.menuItemDots} aria-hidden="true" />
                        <span className={styles.menuItemPrice}>{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {menu.footnote ? <p className={styles.menuFootnote}>{menu.footnote}</p> : null}
            </details>
          </figure>
        ))}
      </section>

      <section className={styles.gallery} aria-label="Интерьер кофейни">
        <h2 className={styles.galleryHeading}>Как у нас внутри</h2>
        <div className={styles.galleryGrid}>
          {GALLERY_PLACEHOLDERS.map((label) => (
            <div key={label} className={styles.galleryPlaceholder}>
              <span className={styles.galleryPlaceholderLabel}>
                {label} — скоро
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

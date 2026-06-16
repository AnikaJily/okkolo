import { useEffect, useState } from 'react';
import { Picture } from '@/components/ui/Picture';
import { CAFE_HERO } from '@/data/cafe';
import {
  cafeMenusFromFallback,
  loadCafeMenus,
  type CafeMenuView,
} from '@/lib/cafe';
import styles from './CafePage.module.css';

export function CafePage() {
  /* Стартуем со статичных меню — пока CMS не ответила, страница уже выглядит как обычно */
  const [menus, setMenus] = useState<CafeMenuView[]>(() => cafeMenusFromFallback());

  useEffect(() => {
    let cancelled = false;
    loadCafeMenus().then((result) => {
      if (cancelled) return;
      if (!result.isFallback) setMenus(result.menus);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main id="main" className={styles.root}>
      <section className={styles.hero} aria-labelledby="cafe-heading">
        <div className={`${styles.heroContent} sectionHeadGap`}>
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
              Каждый купленный стакан помогает проекту жить: выручка кофейни идет
              на обучение и трудоустройство новых ребят. Зайдите на чашку — это и
              есть самый простой способ нас поддержать.
            </p>
          </div>
        </div>
        <div className={styles.heroMedia}>
          <Picture
            picture={CAFE_HERO.picture}
            alt={CAFE_HERO.alt}
            className={styles.heroImage}
            loading="eager"
            // @ts-expect-error React typings lag behind the HTML spec
            fetchpriority="high"
            sizes="(min-width: 1024px) 620px, 100vw"
          />
        </div>
      </section>

      <section className={styles.menus} aria-label="Меню кофейни">
        {menus.map((menu) => (
          <figure key={menu.id} className={styles.menuFigure}>
            {menu.picture ? (
              <Picture
                picture={menu.picture}
                alt={menu.alt}
                className={styles.menuImage}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            ) : menu.imageUrl ? (
              <img
                src={menu.imageUrl}
                alt={menu.alt}
                className={styles.menuImage}
                loading="lazy"
                decoding="async"
              />
            ) : null}
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
    </main>
  );
}

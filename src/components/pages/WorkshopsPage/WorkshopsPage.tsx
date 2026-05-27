import { useEffect, useState } from 'react';
import type { Direction } from '@/data/directions';
import { workshopStudios as fallbackStudios } from '@/data/directions';
import { SUPPORT_HREF } from '@/data/site';
import { filterWorkshopsDirections, loadWorkshopsDirections } from '@/lib/workshops';
import { WorkshopListingCard } from './WorkshopListingCard';
import styles from './WorkshopsPage.module.css';

export function WorkshopsPage() {
  const [directions, setDirections] = useState<Direction[]>(() =>
    filterWorkshopsDirections(fallbackStudios),
  );

  useEffect(() => {
    loadWorkshopsDirections().then(setDirections);
  }, []);

  return (
    <main className={styles.root}>
      <a href="#workshops-list" className={styles.skipLink}>
        Перейти к списку программ
      </a>

      <header className={styles.intro}>
        <h1 id="workshops-page-heading" className={styles.heading}>
          Мастерские
        </h1>
        <p className={styles.lead}>
          Здесь собраны постоянные форматы «Окколо»: циклы, воркшопы и лаборатории с понятным
          расписанием, составом группы и тем, что уже включено в стоимость — как принято в
          нормальных школьных программах.
        </p>
        <h2 id="workshops-tips-heading" className={styles.srOnly}>
          Как устроена запись
        </h2>
        <ul className={styles.highlights} aria-labelledby="workshops-tips-heading">
          <li>запись и уточнения — по почте или в ответ на рассылку (без бесконечных чатов);</li>
          <li>небольшие группы и фиксированные слоты, чтобы всем хватило инструментов;</li>
          <li>материалы первого блока и базовые расходники обычно в цене — смотрите карточку курса.</li>
        </ul>
        <p className={styles.ctaLine}>
          Не нашли подходящий слот?{' '}
          <a className={styles.ctaLink} href={SUPPORT_HREF}>
            Напишите нам<span className={styles.srOnly}> (откроется почтовый клиент)</span>
          </a>
          — подскажем ближайшую группу или лист ожидания.
        </p>
      </header>

      {directions.length === 0 ? (
        <p className={styles.empty}>Скоро здесь появятся карточки мастерских.</p>
      ) : (
        <section
          id="workshops-list"
          className={styles.programs}
          aria-labelledby="workshops-programs-heading"
        >
          <h2 id="workshops-programs-heading" className={styles.srOnly}>
            Программы мастерских
          </h2>
          {directions.map((item, index) => (
            <WorkshopListingCard key={`${item.id}__${index}`} direction={item} />
          ))}
        </section>
      )}
    </main>
  );
}

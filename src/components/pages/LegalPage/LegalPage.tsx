import { LEGAL_DOCS, LEGAL_NAV, type LegalDocId } from '@/data/legal';
import { CONTACT_EMAIL } from '@/data/site';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import styles from './LegalPage.module.css';

interface LegalPageProps {
  doc: LegalDocId;
}

export function LegalPage({ doc }: LegalPageProps) {
  const document = LEGAL_DOCS[doc];
  useDocumentTitle(document.title);
  const related = LEGAL_NAV.filter((item) => item.id !== doc);

  return (
    <main id="main" className={styles.root}>
      <header className={`${styles.head} sectionHeadGap`}>
        <h1 className={styles.title}>{document.title}</h1>
        <p className={styles.lead}>
          Документ готовится. Официальная версия будет опубликована на этой странице
          в ближайшее время.
        </p>
      </header>

      <section
        className={`${styles.simpleSection} sectionHeadGap`}
        aria-labelledby="legal-contact-heading"
      >
        <h2 id="legal-contact-heading" className={styles.sectionTitle}>
          Пока документа нет
        </h2>
        <div className={styles.sectionBody}>
          <p className={styles.bodyText}>
            Если у вас есть вопрос о покупке, возврате или обработке ваших данных —
            напишите нам на почту{' '}
            <a className={styles.inlineLink} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            , мы ответим и поможем.
          </p>
        </div>
      </section>

      {related.length > 0 ? (
        <div className={styles.footerRow}>
          <nav className={styles.relatedNav} aria-label="Другие документы">
            {related.map((item) => (
              <a key={item.id} className={styles.inlineLink} href={item.href}>
                {item.navLabel}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </main>
  );
}

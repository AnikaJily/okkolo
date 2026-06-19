import {
  LEGAL_DOCS,
  LEGAL_NAV,
  LEGAL_OPERATOR,
  LEGAL_UPDATED,
  type LegalBlock,
  type LegalDocId,
} from '@/data/legal';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import styles from './LegalPage.module.css';

interface LegalPageProps {
  doc: LegalDocId;
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === 'list') {
    return (
      <ul className={styles.list}>
        {block.items.map((item, index) => (
          <li key={index} className={styles.listItem}>
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return <p className={styles.bodyText}>{block.text}</p>;
}

function OperatorBlock({ heading }: { heading: string }) {
  const { legalName, inn, ogrn, registeredAddress, actualAddress, email, emailHref } =
    LEGAL_OPERATOR;
  const hasRequisites = Boolean(legalName);

  return (
    <section className={`${styles.simpleSection} sectionHeadGap`} aria-labelledby="legal-operator-heading">
      <h2 id="legal-operator-heading" className={styles.sectionTitle}>
        {heading}
      </h2>
      <dl className={styles.requisites}>
        {hasRequisites ? (
          <>
            <div className={styles.requisiteRow}>
              <dt className={styles.requisiteTerm}>Наименование</dt>
              <dd className={styles.requisiteValue}>{legalName}</dd>
            </div>
            {inn ? (
              <div className={styles.requisiteRow}>
                <dt className={styles.requisiteTerm}>ИНН</dt>
                <dd className={styles.requisiteValue}>{inn}</dd>
              </div>
            ) : null}
            {ogrn ? (
              <div className={styles.requisiteRow}>
                <dt className={styles.requisiteTerm}>ОГРН</dt>
                <dd className={styles.requisiteValue}>{ogrn}</dd>
              </div>
            ) : null}
            {registeredAddress ? (
              <div className={styles.requisiteRow}>
                <dt className={styles.requisiteTerm}>Адрес</dt>
                <dd className={styles.requisiteValue}>{registeredAddress}</dd>
              </div>
            ) : null}
          </>
        ) : null}
        <div className={styles.requisiteRow}>
          <dt className={styles.requisiteTerm}>Пространство</dt>
          <dd className={styles.requisiteValue}>{actualAddress}</dd>
        </div>
        <div className={styles.requisiteRow}>
          <dt className={styles.requisiteTerm}>Почта</dt>
          <dd className={styles.requisiteValue}>
            <a className={styles.inlineLink} href={emailHref}>
              {email}
            </a>
          </dd>
        </div>
      </dl>
      {hasRequisites ? null : (
        <p className={styles.bodyText}>
          Полные юридические реквизиты фонда публикуются в разделе{' '}
          <a className={styles.inlineLink} href="/reports">
            «Отчёты»
          </a>
          . По любому вопросу о покупке, возврате или ваших данных напишите нам на
          почту выше — ответим и поможем.
        </p>
      )}
    </section>
  );
}

export function LegalPage({ doc }: LegalPageProps) {
  const document = LEGAL_DOCS[doc];
  useDocumentTitle(document.title);
  const related = LEGAL_NAV.filter((item) => item.id !== doc);

  return (
    <main id="main" className={styles.root}>
      <header className={`${styles.head} sectionHeadGap`}>
        <h1 className={styles.title}>{document.title}</h1>
        <p className={styles.lead}>{document.lead}</p>
      </header>

      {document.sections.map((section) => (
        <section
          key={section.id}
          className={`${styles.simpleSection} sectionHeadGap`}
          aria-labelledby={`legal-${section.id}-heading`}
        >
          <h2 id={`legal-${section.id}-heading`} className={styles.sectionTitle}>
            {section.heading}
          </h2>
          <div className={styles.sectionBody}>
            {section.blocks.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </div>
        </section>
      ))}

      <OperatorBlock heading={document.operatorHeading} />

      <div className={styles.footerRow}>
        <p className={styles.updated}>Документ обновлён: {LEGAL_UPDATED}</p>
        {related.length > 0 ? (
          <nav className={styles.relatedNav} aria-label="Другие документы">
            {related.map((item) => (
              <a key={item.id} className={styles.inlineLink} href={item.href}>
                {item.navLabel}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </main>
  );
}

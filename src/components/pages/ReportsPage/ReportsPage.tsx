import { useEffect, useRef, useState } from 'react';
import {
  ANNUAL_REPORTS,
  DOCUMENTS_GROUPS,
  MONTHLY_REPORTS,
  REPORTS_TABS,
  REPORTS_UPDATED,
  type AnnualReportGroup,
  type DocumentsGroup,
  type MonthlyReportGroup,
  type ReportFile,
  type ReportsTabId,
} from '@/data/reports';
import { loadReports } from '@/lib/reports';
import styles from './ReportsPage.module.css';

const VALID_TABS = REPORTS_TABS.map((tab) => tab.id) as ReportsTabId[];
const TAB_HASH_PREFIX = '#tab-';

function getInitialTab(): ReportsTabId {
  if (typeof window === 'undefined') return VALID_TABS[0];
  const hash = window.location.hash;
  if (!hash.startsWith(TAB_HASH_PREFIX)) return VALID_TABS[0];
  const candidate = hash.slice(TAB_HASH_PREFIX.length) as ReportsTabId;
  return VALID_TABS.includes(candidate) ? candidate : VALID_TABS[0];
}

function PdfIcon() {
  return (
    <svg
      className={styles.fileIcon}
      width="32"
      height="38"
      viewBox="0 0 32 38"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 2.5h14.5L28 12v23a1.5 1.5 0 0 1-1.5 1.5h-22A1.5 1.5 0 0 1 3 35V4a1.5 1.5 0 0 1 1-1.5z"
        fill="var(--color-purple-subtle)"
        stroke="var(--color-purple-dark)"
        strokeWidth="1.6"
      />
      <path
        d="M18.5 2.5V11a1 1 0 0 0 1 1H28"
        stroke="var(--color-purple-dark)"
        strokeWidth="1.6"
        fill="none"
      />
      <text
        x="16"
        y="29"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="9"
        fontWeight="600"
        fill="var(--color-purple-text)"
      >
        PDF
      </text>
    </svg>
  );
}

interface FileLinkProps {
  file: ReportFile;
}

function FileLink({ file }: FileLinkProps) {
  if (file.available && file.href) {
    return (
      <li className={styles.fileItem}>
        <a
          href={file.href}
          className={styles.fileLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Скачать PDF: ${file.title}`}
        >
          <PdfIcon />
          <span className={styles.fileTitle}>{file.title}</span>
          <span className={styles.fileMeta} aria-hidden="true">
            PDF
          </span>
        </a>
      </li>
    );
  }

  return (
    <li className={styles.fileItem}>
      <div className={styles.fileLinkPending} aria-disabled="true">
        <PdfIcon />
        <span className={styles.fileTitle}>{file.title}</span>
        <span className={styles.fileMetaPending}>скоро</span>
      </div>
    </li>
  );
}

function MonthlyPanel({ groups }: { groups: readonly MonthlyReportGroup[] }) {
  if (groups.length === 0) {
    return <p className={styles.empty}>Отчетов пока нет.</p>;
  }

  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <section
          key={group.year}
          className={styles.group}
          aria-labelledby={`monthly-${group.year}`}
        >
          <h3 id={`monthly-${group.year}`} className={styles.groupHeading}>
            {group.year}
          </h3>
          <ul className={styles.fileList}>
            {group.reports.map((report) => (
              <FileLink key={report.id} file={report} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function AnnualPanel({ groups }: { groups: readonly AnnualReportGroup[] }) {
  if (groups.length === 0) {
    return <p className={styles.empty}>Отчетов пока нет.</p>;
  }

  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <section
          key={group.year}
          className={styles.group}
          aria-labelledby={`annual-${group.year}`}
        >
          <h3 id={`annual-${group.year}`} className={styles.groupHeading}>
            {group.year}
          </h3>
          <ul className={styles.fileList}>
            {group.reports.map((report) => (
              <FileLink key={report.id} file={report} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function DocumentsPanel({ groups }: { groups: readonly DocumentsGroup[] }) {
  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <section
          key={group.id}
          className={styles.group}
          aria-labelledby={`docs-${group.id}`}
        >
          <h3 id={`docs-${group.id}`} className={styles.groupHeading}>
            {group.title}
          </h3>
          <ul className={styles.fileList}>
            {group.documents.map((doc) => (
              <FileLink key={doc.id} file={doc} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportsTabId>(() => getInitialTab());
  /* Стартуем с мок-каркаса (заглушки «скоро»), затем заменяем тем, что вернёт CMS */
  const [monthly, setMonthly] = useState<readonly MonthlyReportGroup[]>(MONTHLY_REPORTS);
  const [annual, setAnnual] = useState<readonly AnnualReportGroup[]>(ANNUAL_REPORTS);
  const [documents, setDocuments] = useState<readonly DocumentsGroup[]>(DOCUMENTS_GROUPS);
  const tabRefs = useRef<Record<ReportsTabId, HTMLButtonElement | null>>({
    monthly: null,
    annual: null,
    documents: null,
  });

  useEffect(() => {
    const onHashChange = () => setActiveTab(getInitialTab());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadReports().then((result) => {
      if (cancelled || result.isFallback) return;
      setMonthly(result.monthly);
      setAnnual(result.annual);
      setDocuments(result.documents);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleTabSelect = (id: ReportsTabId) => {
    setActiveTab(id);
    if (typeof window !== 'undefined') {
      const newHash = `${TAB_HASH_PREFIX}${id}`;
      const url = `${window.location.pathname}${window.location.search}${newHash}`;
      window.history.replaceState(null, '', url);
    }
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const currentIndex = VALID_TABS.indexOf(activeTab);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + direction + VALID_TABS.length) % VALID_TABS.length;
    const nextId = VALID_TABS[nextIndex];
    handleTabSelect(nextId);
    tabRefs.current[nextId]?.focus();
  };

  return (
    <main id="main" className={styles.root}>
      <h1 className={styles.heading}>Отчеты и документы</h1>

      <section
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className={styles.panel}
      >
        <div
          role="tablist"
          aria-label="Разделы отчетности"
          className={styles.tablist}
        >
          {REPORTS_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[tab.id] = node;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabSelect(tab.id)}
                onKeyDown={handleTabKeyDown}
                className={isActive ? styles.tabActive : styles.tab}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'monthly' ? <MonthlyPanel groups={monthly} /> : null}
        {activeTab === 'annual' ? <AnnualPanel groups={annual} /> : null}
        {activeTab === 'documents' ? <DocumentsPanel groups={documents} /> : null}
      </section>

      <div className={styles.updatedWrap}>
        <p className={styles.updated}>Раздел обновлен: {REPORTS_UPDATED}</p>
      </div>
    </main>
  );
}

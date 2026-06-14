/**
 * Данные раздела «Отчеты» (/reports).
 *
 * Окколо — некоммерческий проект, поэтому отчеты для нас — это про
 * прозрачность, а не формальность. Здесь живут три типа документов:
 * 1) ежемесячные содержательные отчеты,
 * 2) годовые (содержательный + финансовый + отчеты в Минюст),
 * 3) учредительные документы и реквизиты фонда.
 *
 * Файлы пока не загружены — у каждого пункта есть `available: false`
 * и подпись «скоро будет опубликован». Когда PDF появится, замени
 * `available` на `true` и проставь `href` (можно отдавать через CMS
 * или просто положить в /public/reports/).
 */

export type ReportsTabId = 'monthly' | 'annual' | 'documents';

export interface ReportsTab {
  id: ReportsTabId;
  label: string;
}

export const REPORTS_TABS: readonly ReportsTab[] = [
  {
    id: 'monthly',
    label: 'Ежемесячные отчеты',
  },
  {
    id: 'annual',
    label: 'Годовые отчеты',
  },
  {
    id: 'documents',
    label: 'Документы',
  },
] as const;

export interface ReportFile {
  id: string;
  title: string;
  /** Ссылка на PDF. Пусто — пока документ не опубликован */
  href: string;
  /** Опубликован ли документ. false → показываем пометку «скоро» */
  available: boolean;
}

export interface MonthlyReportGroup {
  year: number;
  reports: readonly (ReportFile & { month: string })[];
}

const MONTHS_RU = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
] as const;

function monthlyPlaceholder(year: number, untilMonthIndex: number) {
  return MONTHS_RU.slice(0, untilMonthIndex + 1).map((month, index) => ({
    id: `monthly-${year}-${index + 1}`,
    title: `${month} ${year}`,
    month,
    href: '',
    available: false,
  }));
}

/** Ежемесячные отчеты от свежего к старому. Сейчас все — заглушки. */
export const MONTHLY_REPORTS: readonly MonthlyReportGroup[] = [
  {
    year: 2026,
    reports: monthlyPlaceholder(2026, 4),
  },
  {
    year: 2025,
    reports: monthlyPlaceholder(2025, 11).reverse(),
  },
] as const;

export interface AnnualReportGroup {
  year: number;
  reports: readonly ReportFile[];
}

/** Годовые отчеты. За 2025 еще нет содержательного — добавится весной 2026. */
export const ANNUAL_REPORTS: readonly AnnualReportGroup[] = [
  {
    year: 2025,
    reports: [
      {
        id: 'annual-2025-content',
        title: 'Годовой содержательный отчет',
        href: '',
        available: false,
      },
      {
        id: 'annual-2025-finance',
        title: 'Финансовый отчет',
        href: '',
        available: false,
      },
    ],
  },
  {
    year: 2024,
    reports: [
      {
        id: 'annual-2024-content',
        title: 'Годовой содержательный отчет',
        href: '',
        available: false,
      },
      {
        id: 'annual-2024-finance',
        title: 'Финансовый отчет',
        href: '',
        available: false,
      },
      {
        id: 'annual-2024-nko',
        title: 'Отчет о деятельности НКО',
        href: '',
        available: false,
      },
      {
        id: 'annual-2024-spending',
        title: 'Отчет о целях расходования денежных средств',
        href: '',
        available: false,
      },
    ],
  },
] as const;

export interface DocumentsGroup {
  id: string;
  title: string;
  documents: readonly ReportFile[];
}

/** Учредительные документы и реквизиты — публикуем по мере получения. */
export const DOCUMENTS_GROUPS: readonly DocumentsGroup[] = [
  {
    id: 'requisites',
    title: 'Реквизиты',
    documents: [
      {
        id: 'doc-requisites',
        title: 'Реквизиты фонда',
        href: '',
        available: false,
      },
    ],
  },
  {
    id: 'foundation',
    title: 'Учредительные документы',
    documents: [
      { id: 'doc-charter', title: 'Устав фонда', href: '', available: false },
      { id: 'doc-inn', title: 'Свидетельство ИНН', href: '', available: false },
      { id: 'doc-usn', title: 'Письмо об УСН', href: '', available: false },
      { id: 'doc-egrul', title: 'Свидетельство ЕГРЮЛ', href: '', available: false },
    ],
  },
  {
    id: 'privacy',
    title: 'Положение о персональных данных',
    documents: [
      {
        id: 'doc-privacy',
        title: 'Положение о персональных данных',
        href: '',
        available: false,
      },
    ],
  },
] as const;

/** Дата последнего обновления раздела — меняй при публикации новых отчетов */
export const REPORTS_UPDATED = 'июнь 2026';

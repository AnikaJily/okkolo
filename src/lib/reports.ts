import {
  ANNUAL_REPORTS as FALLBACK_ANNUAL_REPORTS,
  DOCUMENTS_GROUPS as FALLBACK_DOCUMENTS_GROUPS,
  type AnnualReportGroup,
  type DocumentsGroup,
  type ReportFile,
} from '@/data/reports';
import {
  fetchAnnualReports,
  fetchLegalDocuments,
  getStrapiFileUrl,
  type StrapiAnnualReport,
  type StrapiAnnualReportKind,
  type StrapiLegalDocument,
  type StrapiLegalDocumentCategory,
} from '@/lib/strapi';

const ANNUAL_KIND_TITLES: Record<StrapiAnnualReportKind, string> = {
  content: 'Годовой содержательный отчет',
  finance: 'Финансовый отчет',
  'nko-activity': 'Отчет о деятельности НКО',
  spending: 'Отчет о целях расходования денежных средств',
};

/* Порядок годовых отчётов внутри одного года — от «крупного» к «нишевому» */
const ANNUAL_KIND_ORDER: StrapiAnnualReportKind[] = [
  'content',
  'finance',
  'nko-activity',
  'spending',
];

const DOCUMENT_CATEGORY_ORDER: StrapiLegalDocumentCategory[] = [
  'requisites',
  'foundation',
  'privacy',
];

const DOCUMENT_CATEGORY_META: Record<
  StrapiLegalDocumentCategory,
  { id: string; title: string }
> = {
  requisites: { id: 'requisites', title: 'Реквизиты' },
  foundation: { id: 'foundation', title: 'Учредительные документы' },
  privacy: { id: 'privacy', title: 'Положение о персональных данных' },
};

function toReportFile(
  id: string,
  title: string,
  pdfUrl: string | null,
): ReportFile {
  return {
    id,
    title,
    href: pdfUrl ?? '',
    available: Boolean(pdfUrl),
  };
}

function buildAnnualGroups(items: StrapiAnnualReport[]): AnnualReportGroup[] {
  const byYear = new Map<number, StrapiAnnualReport[]>();
  for (const item of items) {
    const bucket = byYear.get(item.year) ?? [];
    bucket.push(item);
    byYear.set(item.year, bucket);
  }

  const years = [...byYear.keys()].sort((a, b) => b - a);
  return years.map((year) => {
    const sorted = (byYear.get(year) ?? []).sort((a, b) => {
      const orderA = ANNUAL_KIND_ORDER.indexOf(a.kind as StrapiAnnualReportKind);
      const orderB = ANNUAL_KIND_ORDER.indexOf(b.kind as StrapiAnnualReportKind);
      return (orderA === -1 ? 99 : orderA) - (orderB === -1 ? 99 : orderB);
    });
    const reports = sorted.map((item) => {
      const title =
        ANNUAL_KIND_TITLES[item.kind as StrapiAnnualReportKind] ?? item.note ?? 'Отчет';
      const pdfUrl = getStrapiFileUrl(item.pdf);
      return toReportFile(`annual-${year}-${item.kind}-${item.id}`, title, pdfUrl);
    });
    return { year, reports };
  });
}

function buildDocumentGroups(items: StrapiLegalDocument[]): DocumentsGroup[] {
  const byCategory = new Map<StrapiLegalDocumentCategory, StrapiLegalDocument[]>();
  for (const item of items) {
    const category = item.category as StrapiLegalDocumentCategory;
    if (!DOCUMENT_CATEGORY_ORDER.includes(category)) continue;
    const bucket = byCategory.get(category) ?? [];
    bucket.push(item);
    byCategory.set(category, bucket);
  }

  return DOCUMENT_CATEGORY_ORDER.flatMap((category) => {
    const bucket = byCategory.get(category);
    if (!bucket || bucket.length === 0) return [];
    const meta = DOCUMENT_CATEGORY_META[category];
    const sorted = [...bucket].sort((a, b) => {
      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title, 'ru');
    });
    return [
      {
        id: meta.id,
        title: meta.title,
        documents: sorted.map((item) =>
          toReportFile(`doc-${category}-${item.id}`, item.title, getStrapiFileUrl(item.pdf)),
        ),
      },
    ];
  });
}

export interface LoadReportsResult {
  annual: readonly AnnualReportGroup[];
  documents: readonly DocumentsGroup[];
  /** true — обе коллекции CMS пусты или недоступны: показываем мок-каркас. */
  isFallback: boolean;
}

export async function loadReports(): Promise<LoadReportsResult> {
  try {
    const [annualItems, documentItems] = await Promise.all([
      fetchAnnualReports().catch(() => [] as StrapiAnnualReport[]),
      fetchLegalDocuments().catch(() => [] as StrapiLegalDocument[]),
    ]);

    const annual = buildAnnualGroups(annualItems);
    const documents = buildDocumentGroups(documentItems);

    const hasAny = annual.length > 0 || documents.length > 0;
    if (hasAny) {
      return {
        annual: annual.length > 0 ? annual : FALLBACK_ANNUAL_REPORTS,
        documents: documents.length > 0 ? documents : FALLBACK_DOCUMENTS_GROUPS,
        isFallback: false,
      };
    }
  } catch (error) {
    console.error('loadReports: fallback на статичные данные', error);
  }
  return {
    annual: FALLBACK_ANNUAL_REPORTS,
    documents: FALLBACK_DOCUMENTS_GROUPS,
    isFallback: true,
  };
}

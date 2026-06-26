/**
 * Юридические страницы сайта «Окколо»: /terms и /privacy.
 *
 * Тексты-черновики (условия покупки и возврата, политика обработки персональных
 * данных) СНЯТЫ — сюда будут прикреплены официальные документы фонда. Пока
 * страницы показывают заглушку (см. LegalPage). Маршруты и ссылки в подвале и
 * у чекбоксов согласия сохранены, чтобы /terms и /privacy не отдавали 404.
 *
 * Прежние черновики с ресёрчем (152-ФЗ ст. 18.1, ст. 26.1 ЗоЗПП, ПП РФ № 2463)
 * лежат в истории git — оттуда же их можно поднять как основу для официальной
 * версии.
 */

export type LegalDocId = 'terms' | 'privacy';

export interface LegalDoc {
  id: LegalDocId;
  /** Маршрут страницы */
  href: string;
  /** Подпись в подвале и навигации */
  navLabel: string;
  /** Заголовок страницы */
  title: string;
}

const TERMS: LegalDoc = {
  id: 'terms',
  href: '/terms',
  navLabel: 'Условия покупки и возврата',
  title: 'Условия покупки и возврата',
};

const PRIVACY: LegalDoc = {
  id: 'privacy',
  href: '/privacy',
  navLabel: 'Обработка персональных данных',
  title: 'Политика обработки персональных данных',
};

export const LEGAL_DOCS: Record<LegalDocId, LegalDoc> = {
  terms: TERMS,
  privacy: PRIVACY,
};

/** Порядок ссылок в подвале */
export const LEGAL_NAV: readonly LegalDoc[] = [TERMS, PRIVACY];

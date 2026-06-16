import { useEffect } from 'react';

const BASE = 'Окколо';
const DEFAULT_TITLE = `${BASE} — инклюзивный социальный проект`;

/**
 * Обновляет document.title при монтировании/смене заголовка.
 * Ручной роутер (App.tsx) не меняет title сам — без этого хука все экраны
 * делят один статичный <title> (нарушение WCAG 2.4.2 Page Titled).
 *
 * - строка → «<title> — Окколо»;
 * - undefined/'' → дефолтный заголовок (главная);
 * - false → не трогать title (App вызывает так на подстраницах, чтобы не
 *   перетереть заголовок, который ставит сам page-компонент: эффект родителя
 *   выполняется после дочерних).
 */
export function useDocumentTitle(title?: string | false) {
  useEffect(() => {
    if (title === false) return;
    document.title = title ? `${title} — ${BASE}` : DEFAULT_TITLE;
  }, [title]);
}

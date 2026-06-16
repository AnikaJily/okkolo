/** Визуальная пометка обязательного поля. Смысл «обязательно» даёт атрибут required на контроле. */
export function RequiredMark() {
  return (
    <span className="requiredMark" aria-hidden="true">
      {' *'}
    </span>
  );
}

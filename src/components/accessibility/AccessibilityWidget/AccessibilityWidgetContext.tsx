import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { A11Y_WIDGET_TRIGGER_LABEL } from '@/data/accessibility';
import eyeIconSrc from '@/assets/images/icon-eye-a11y.svg';
import { CloseIcon } from '@/components/ui/CloseIcon/CloseIcon';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/utils';
import {
  useAccessibility,
  DEFAULT_STATE,
  type A11yState,
  type FontSize,
  type Images,
  type Spacing,
  type Theme,
} from './useAccessibility';
import styles from './AccessibilityWidget.module.css';

const FONT_OPTIONS: { value: FontSize; label: string; sampleClass: string }[] = [
  { value: 'md', label: 'Обычный размер шрифта', sampleClass: styles.sampleFontSm },
  { value: 'lg', label: 'Крупный шрифт', sampleClass: styles.sampleFontMd },
  { value: 'xl', label: 'Очень крупный шрифт', sampleClass: styles.sampleFontLg },
  { value: 'xxl', label: 'Максимально крупный шрифт', sampleClass: styles.sampleFontXl },
];

const SPACING_OPTIONS: { value: Spacing; label: string; spacingClass: string }[] = [
  { value: 'normal', label: 'Обычный межбуквенный интервал', spacingClass: styles.sampleSpacingSm },
  { value: 'wide', label: 'Средний межбуквенный интервал', spacingClass: styles.sampleSpacingMd },
  { value: 'wider', label: 'Большой межбуквенный интервал', spacingClass: styles.sampleSpacingLg },
];

const THEME_OPTIONS: { value: Theme; label: string; swatchClass: string }[] = [
  { value: 'whiteBlack', label: 'Чёрный текст на белом фоне', swatchClass: styles.swatchWhiteBlack },
  { value: 'blackWhite', label: 'Белый текст на чёрном фоне', swatchClass: styles.swatchBlackWhite },
  { value: 'blueCyan', label: 'Тёмно-синий текст на голубом фоне', swatchClass: styles.swatchBlueCyan },
  { value: 'beigeBrown', label: 'Тёмно-коричневый текст на бежевом фоне', swatchClass: styles.swatchBeigeBrown },
  { value: 'brownGreen', label: 'Зелёный текст на тёмно-коричневом фоне', swatchClass: styles.swatchBrownGreen },
];

const IMAGE_OPTIONS: { value: Images; label: string; short: string }[] = [
  { value: 'color', label: 'Цветные изображения', short: 'Цвет' },
  { value: 'bw', label: 'Чёрно-белые изображения', short: 'Ч/Б' },
  { value: 'off', label: 'Скрыть изображения', short: 'Выкл' },
];

// Группы-переключатели, у которых активную кнопку можно отжать (вернуть к дефолту).
const TOGGLEABLE_KEYS = ['fontSize', 'spacing', 'theme', 'images'] as const;

interface AccessibilityWidgetContextValue {
  panelId: string;
  open: boolean;
  enabled: boolean;
  triggerAriaLabel: string;
  togglePanel: () => void;
  floatingTriggerRef: Ref<HTMLButtonElement>;
}

const AccessibilityWidgetContext = createContext<AccessibilityWidgetContextValue | null>(null);

export function useAccessibilityWidget() {
  const context = useContext(AccessibilityWidgetContext);
  if (!context) {
    throw new Error('useAccessibilityWidget must be used within AccessibilityWidgetProvider');
  }
  return context;
}

interface AccessibilityTriggerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'inline' | 'floating';
  fullWidth?: boolean;
  buttonRef?: Ref<HTMLButtonElement>;
}

export function AccessibilityTriggerButton({
  variant = 'inline',
  fullWidth = false,
  className,
  buttonRef,
  ...props
}: AccessibilityTriggerButtonProps) {
  const { panelId, open, triggerAriaLabel, togglePanel } = useAccessibilityWidget();

  return (
    <button
      ref={buttonRef}
      type="button"
      data-a11y-widget
      className={cn(
        styles.trigger,
        variant === 'floating' && styles.triggerFloating,
        fullWidth && styles.triggerFullWidth,
        className,
      )}
      aria-label={triggerAriaLabel}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={togglePanel}
      {...props}
    >
      <img
        src={eyeIconSrc}
        alt=""
        aria-hidden="true"
        className={styles.triggerIcon}
        data-a11y-keep
      />
      <span className={styles.triggerLabel}>{A11Y_WIDGET_TRIGGER_LABEL}</span>
    </button>
  );
}

export function AccessibilityWidgetProvider({ children }: { children: ReactNode }) {
  const { state, update, reset } = useAccessibility();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const fontLabelId = useId();
  const spacingLabelId = useId();
  const themeLabelId = useId();
  const imagesLabelId = useId();
  const floatingTriggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [hideFloatingTrigger, setHideFloatingTrigger] = useState(false);

  const togglePanel = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  // Клик по уже выбранной опции отжимает её (возврат к дефолту), по другой —
  // выбирает. Режим включён, пока хоть один параметр не дефолтный; как только
  // все вернулись к норме — выходим из режима. Подсветку см. в isOptionActive.
  const toggleSetting = useCallback(
    <K extends (typeof TOGGLEABLE_KEYS)[number]>(key: K, value: A11yState[K]) => {
      const nextValue = state[key] === value ? DEFAULT_STATE[key] : value;
      const allDefault =
        nextValue === DEFAULT_STATE[key] &&
        TOGGLEABLE_KEYS.every((k) => k === key || state[k] === DEFAULT_STATE[k]);
      update({ [key]: nextValue, enabled: !allDefault } as Partial<A11yState>);
    },
    [state, update],
  );

  // «Обычные» (первые) опции каждой группы — это значения по умолчанию.
  // Подсвечиваем кнопку, только если выбрано НЕ дефолтное значение: иначе при
  // выключенном режиме первая опция каждой группы выглядела бы выбранной, а клик
  // по ней (дефолт→дефолт) ничего не менял — казалось, что «не работает».
  const isOptionActive = <K extends (typeof TOGGLEABLE_KEYS)[number]>(
    key: K,
    value: A11yState[K],
  ) => state[key] === value && value !== DEFAULT_STATE[key];

  const triggerAriaLabel = open
    ? 'Скрыть панель настроек доступности'
    : 'Открыть панель настроек доступности';

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      panelRef.current?.focus();
    });
  }, [open]);

  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      root.removeAttribute('data-a11y-panel-open');
      root.style.removeProperty('--a11y-panel-h');
      return;
    }
    root.setAttribute('data-a11y-panel-open', '');
    const el = panelRef.current;
    if (!el) return;
    const sync = () => {
      root.style.setProperty('--a11y-panel-h', `${el.offsetHeight}px`);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.removeAttribute('data-a11y-panel-open');
      root.style.removeProperty('--a11y-panel-h');
    };
  }, [open]);

  useEffect(() => {
    const target = document.getElementById('footer-a11y-trigger');
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHideFloatingTrigger(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const dismissPanel = useCallback(() => {
    setOpen(false);
    floatingTriggerRef.current?.focus();
  }, []);

  const handleExit = () => {
    reset();
  };

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      dismissPanel();
    }
  };

  const contextValue = useMemo(
    () => ({
      panelId,
      open,
      enabled: state.enabled,
      triggerAriaLabel,
      togglePanel,
      floatingTriggerRef,
    }),
    [panelId, open, state.enabled, triggerAriaLabel, togglePanel],
  );

  return (
    <AccessibilityWidgetContext.Provider value={contextValue}>
      {children}
      <div data-a11y-widget>
        <AccessibilityTriggerButton
          variant="floating"
          buttonRef={floatingTriggerRef}
          className={hideFloatingTrigger ? styles.triggerFloatingHidden : undefined}
        />

        {open && (
          <div
            id={panelId}
            ref={panelRef}
            className={styles.panel}
            role="region"
            tabIndex={-1}
            aria-label="Настройки версии для слабовидящих"
            onKeyDown={handlePanelKeyDown}
          >
            <div className={styles.panelBar}>
              <p className={styles.panelTitle}>Версия для слабовидящих</p>
              <IconButton
                label="Свернуть панель доступности"
                className={styles.collapse}
                onClick={dismissPanel}
              >
                <CloseIcon size="sheet" />
              </IconButton>
            </div>

            <div className={styles.inner}>
              <div className={styles.settings}>
                <div className={styles.group} role="group" aria-labelledby={fontLabelId}>
                  <span id={fontLabelId} className={styles.groupLabel}>
                    Размер шрифта
                  </span>
                  <div className={styles.options}>
                    {FONT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={styles.option}
                        aria-label={opt.label}
                        aria-pressed={isOptionActive('fontSize', opt.value)}
                        onClick={() => toggleSetting('fontSize', opt.value)}
                      >
                        <span className={`${styles.sample} ${opt.sampleClass}`}>A</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.group} role="group" aria-labelledby={spacingLabelId}>
                  <span id={spacingLabelId} className={styles.groupLabel}>
                    Интервал
                  </span>
                  <div className={styles.options}>
                    {SPACING_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={styles.option}
                        aria-label={opt.label}
                        aria-pressed={isOptionActive('spacing', opt.value)}
                        onClick={() => toggleSetting('spacing', opt.value)}
                      >
                        <span className={`${styles.sample} ${opt.spacingClass}`}>Аа</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.group} role="group" aria-labelledby={themeLabelId}>
                  <span id={themeLabelId} className={styles.groupLabel}>
                    Цветовая схема
                  </span>
                  <div className={styles.options}>
                    {THEME_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`${styles.option} ${styles.optionSwatch} ${opt.swatchClass}`}
                        aria-label={opt.label}
                        aria-pressed={isOptionActive('theme', opt.value)}
                        onClick={() => toggleSetting('theme', opt.value)}
                      >
                        <span className={styles.swatchLetter}>А</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.group} role="group" aria-labelledby={imagesLabelId}>
                  <span id={imagesLabelId} className={styles.groupLabel}>
                    Изображения
                  </span>
                  <div className={styles.options}>
                    {IMAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={styles.option}
                        aria-label={opt.label}
                        aria-pressed={isOptionActive('images', opt.value)}
                        onClick={() => toggleSetting('images', opt.value)}
                      >
                        {opt.short}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.exit} onClick={handleExit}>
                  Обычная версия
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AccessibilityWidgetContext.Provider>
  );
}

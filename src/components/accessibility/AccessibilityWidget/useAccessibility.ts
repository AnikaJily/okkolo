import { useCallback, useEffect, useState } from 'react';

export type FontSize = 'md' | 'lg' | 'xl';
export type Spacing = 'normal' | 'wide' | 'wider';
export type Theme = 'whiteBlack' | 'blackWhite' | 'blueCyan' | 'beigeBrown' | 'brownGreen';
export type Images = 'color' | 'bw' | 'off';

export interface A11yState {
  enabled: boolean;
  fontSize: FontSize;
  spacing: Spacing;
  theme: Theme;
  images: Images;
}

const STORAGE_KEY = 'okkolo-a11y-v1';

const DEFAULT_STATE: A11yState = {
  enabled: false,
  fontSize: 'md',
  spacing: 'normal',
  theme: 'whiteBlack',
  images: 'color',
};

const FONT_VALUES: FontSize[] = ['md', 'lg', 'xl'];
const SPACING_VALUES: Spacing[] = ['normal', 'wide', 'wider'];
const THEME_VALUES: Theme[] = ['whiteBlack', 'blackWhite', 'blueCyan', 'beigeBrown', 'brownGreen'];
const IMAGE_VALUES: Images[] = ['color', 'bw', 'off'];

function oneOf<T extends string>(value: unknown, allowed: T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function readState(): A11yState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<A11yState>;
    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : false,
      fontSize: oneOf(parsed.fontSize, FONT_VALUES, 'md'),
      spacing: oneOf(parsed.spacing, SPACING_VALUES, 'normal'),
      theme: oneOf(parsed.theme, THEME_VALUES, 'whiteBlack'),
      images: oneOf(parsed.images, IMAGE_VALUES, 'color'),
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function applyToDom(state: A11yState) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (state.enabled) {
    root.setAttribute('data-a11y', '');
    root.setAttribute('data-a11y-font', state.fontSize);
    root.setAttribute('data-a11y-spacing', state.spacing);
    root.setAttribute('data-a11y-theme', state.theme);
    root.setAttribute('data-a11y-images', state.images);
  } else {
    root.removeAttribute('data-a11y');
    root.removeAttribute('data-a11y-font');
    root.removeAttribute('data-a11y-spacing');
    root.removeAttribute('data-a11y-theme');
    root.removeAttribute('data-a11y-images');
  }
}

export function useAccessibility() {
  const [state, setState] = useState<A11yState>(readState);

  useEffect(() => {
    applyToDom(state);
    if (typeof window === 'undefined') return;
    try {
      if (state.enabled) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // storage недоступен — переживём
    }
  }, [state]);

  const update = useCallback((patch: Partial<A11yState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return { state, update, reset };
}

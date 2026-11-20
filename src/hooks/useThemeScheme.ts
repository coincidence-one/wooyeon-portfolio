import { useEffect, useState } from 'react';

export type ResolvedColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'color-scheme';

const getSystemScheme = (): ResolvedColorScheme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const getStoredScheme = (): ResolvedColorScheme | null => {
  if (typeof window === 'undefined') return null;
  try {
    const val = window.localStorage.getItem(STORAGE_KEY);
    return val === 'light' || val === 'dark' ? val : null;
  } catch {
    return null;
  }
};

const syncMetaColorScheme = (stored: ResolvedColorScheme | null): void => {
  if (typeof document === 'undefined') return;
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="color-scheme"]'
  );
  if (!meta) return;
  meta.setAttribute('content', stored ?? 'light dark');
};

export const useThemeScheme = () => {
  const [storedScheme, setStoredScheme] = useState<ResolvedColorScheme | null>(
    () => getStoredScheme()
  );
  const [systemScheme, setSystemScheme] = useState<ResolvedColorScheme>(() =>
    getSystemScheme()
  );

  const resolvedScheme: ResolvedColorScheme = storedScheme ?? systemScheme;

  useEffect(() => {
    syncMetaColorScheme(storedScheme);
  }, [storedScheme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setSystemScheme(event.matches ? 'dark' : 'light');
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next =
        event.newValue === 'light' || event.newValue === 'dark'
          ? event.newValue
          : null;
      setStoredScheme(next);
      syncMetaColorScheme(next);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Modern Web Guidance (`dark-mode-toggle`):
  // Two-state toggle removes storage when target matches current system preference
  const toggleTheme = () => {
    const currentSystem = getSystemScheme();
    const target: ResolvedColorScheme =
      resolvedScheme === 'dark' ? 'light' : 'dark';

    const nextStored: ResolvedColorScheme | null =
      target === currentSystem ? null : target;

    try {
      if (nextStored === null) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, nextStored);
      }
    } catch {
      // Still apply the theme even when localStorage is blocked
    }

    setStoredScheme(nextStored);
    syncMetaColorScheme(nextStored);
  };

  return {
    resolvedScheme,
    isSystemDefault: storedScheme === null,
    toggleTheme,
  };
};

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { router } from '@inertiajs/react';
import { locales } from '../locales';

interface TranslationContextType {
  locale: string;
  changeLocale: (code: string) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  const t = (key: string, replacements?: Record<string, string>): string => {
    const [file, ...rest] = key.split('.');
    const keyPath = rest.join('.');

    const currentLocales = (locales as any)[locale] || locales.en;
    let translation = (file && currentLocales?.[file]?.[keyPath]) ?? key;

    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        translation = translation.replace(`:${k}`, v);
      });
    }

    return translation;
  };

  const changeLocale = (code: string) => {
    localStorage.setItem('locale', code);
    setLocale(code);
    router.get(`/lang/${code}`, {}, {
      preserveScroll: true,
    });
  };

  return (
    <TranslationContext.Provider value={{ locale, changeLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}

import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { locales } from '../locales';

export function useTranslation() {
    const [locale, setLocale] = useState('en');

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale');
        if (savedLocale) {
            setLocale(savedLocale);
        }
    }, []);

    const t = (key: string, replacements?: Record<string, string>): string => {
        // key format: "file.key" e.g. "app.welcome"
        const [file, ...rest] = key.split('.');
        const keyPath = rest.join('.');

        const currentLocales = (locales as any)[locale] || locales.en;
        let translation = (file && currentLocales?.[file]?.[keyPath]) ?? key;

        // Handle replacements: :name => value
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
    };

    return { t, locale, changeLocale };
}
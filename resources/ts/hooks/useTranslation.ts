import { usePage } from '@inertiajs/react';

type Translations = Record<string, Record<string, string>>;

export function useTranslation() {
    const { translations, locale } = usePage<{
        translations: Translations;
        locale: string;
    }>().props;

    const t = (key: string, replacements?: Record<string, string>): string => {
        // key format: "file.key" e.g. "app.welcome"
        const [file, ...rest] = key.split('.');
        const keyPath = rest.join('.');

        let translation = (file && translations?.[file]?.[keyPath]) ?? key;

        // Handle replacements: :name => value
        if (replacements) {
            Object.entries(replacements).forEach(([k, v]) => {
                translation = translation.replace(`:${k}`, v);
            });
        }

        return translation;
    };

    return { t, locale };
}
import { useTranslation } from '@/hooks/useTranslation';
import { router } from '@inertiajs/react';

const LOCALES = [
    { code: 'en', label: '🇬🇧 English' },
    { code: 'id', label: '🇮🇩 Indonesia' },
];

export default function LanguageSwitcher() {
    const { locale } = useTranslation();

    const switchLang = (code: string) => {
        router.get(`/lang/${code}`);
    };

    return (
        <div className="flex gap-2 absolute top-8 right-8 z-50">
            {LOCALES.map(({ code, label }) => (
                <button
                    key={code}
                    onClick={() => switchLang(code)}
                    className={`px-3 py-1 rounded text-sm border ${
                        locale === code
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
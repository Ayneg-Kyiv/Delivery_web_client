'use client';

import { useI18n } from '@/i18n/I18nProvider';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const switchTo = (l: 'en' | 'uk') => {
    if (locale === l) return;
    document.cookie = `locale=${l};path=/;max-age=31536000;samesite=lax`;
    setLocale(l);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => switchTo('uk')}
        aria-pressed={locale === 'uk'}
        className="font-semibold text-sm transition-opacity hover:opacity-100 aria-pressed:opacity-100 opacity-60"
      >
        UA
      </button>
      <div className="w-px h-4 bg-white/40" />
      <button
        type="button"
        onClick={() => switchTo('en')}
        aria-pressed={locale === 'en'}
        className="font-semibold text-sm transition-opacity hover:opacity-100 aria-pressed:opacity-100 opacity-60"
      >
        EN
      </button>
    </div>
  );
}

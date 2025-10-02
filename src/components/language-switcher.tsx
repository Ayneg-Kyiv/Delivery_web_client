"use client";

import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { setCookie } from '@/utils/cookies';
import { useRouter } from 'next/navigation';

const LanguageSwitcher: React.FC = () => {
  const { language, setLocale } = useI18n();
  const router = useRouter();

  const setLang = (lang: 'uk' | 'en') => {
    if (lang === language) return;
    setCookie('locale', lang);
    setLocale(lang);
    router.refresh();
  };

  return (
    <div
      className="relative inline-flex items-center w-24 h-9 rounded-xl border border-white box-border p-1 select-none bg-white/10"
      role="group"
      aria-label="Language switcher"
    >
      {/* Animated thumb */}
      <div
        className={`absolute top-1 bottom-1 left-1 rounded-lg bg-white/25 transition-transform duration-200 ease-out w-[calc(50%-4px)] ${
          language === 'uk' ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden
      />

      {/* УКР */}
      <button
        type="button"
        onClick={() => setLang('uk')}
        aria-pressed={language === 'uk'}
        className={`relative z-10 flex-1 h-full text-xs leading-none font-medium focus:outline-none transition-colors ${
          language === 'uk' ? 'text-[#2c1b48]' : 'text-white'
        }`}
      >
        УКР
      </button>

      {/* ENG */}
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={language === 'en'}
        className={`relative z-10 flex-1 h-full text-xs leading-none font-medium focus:outline-none transition-colors ${
          language === 'en' ? 'text-[#2c1b48]' : 'text-white'
        }`}
      >
        ENG
      </button>
    </div>
  );
};

export default LanguageSwitcher;

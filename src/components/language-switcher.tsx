"use client";

import { useI18n } from '@/i18n/I18nProvider';
import React from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

const LanguageSwitcher: React.FC = () => {
  const { language, setLocale } = useI18n();
  const router = useRouter();

  const handleLanguageChange = (lang: 'en' | 'uk') => {
    if (language === lang) return;
    setCookie('locale', lang);
    setLocale(lang);
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('uk')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          language === 'uk' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        УКР
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          language === 'en' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        ENG
      </button>
    </div>
  );
};

export default LanguageSwitcher;


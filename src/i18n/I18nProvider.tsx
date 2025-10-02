"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import en from './messages/en';
import uk from './messages/uk';
import { setCookie } from '@/utils/cookies';

type Locale = 'en' | 'uk';
type Messages = typeof en | typeof uk;

export type I18nContextValue = {
  language: Locale;
  messages: Messages;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export default function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const setAndStoreLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setCookie('locale', newLocale);
    if (typeof document !== 'undefined') {
        document.documentElement.lang = newLocale;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const messages = useMemo(() => (locale === 'en' ? en : uk), [locale]);

  const value = useMemo(() => ({
    language: locale,
    messages,
    setLocale: setAndStoreLocale,
  }), [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}


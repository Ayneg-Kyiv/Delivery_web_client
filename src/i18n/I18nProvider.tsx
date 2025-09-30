"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from './messages/en';
import uk from './messages/uk';

type Locale = 'en' | 'uk';
type Messages = typeof en | typeof uk;

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

function getInitialLocale(): Locale {
  if (typeof document !== 'undefined') {
    const m = document.cookie.match(/(?:^|; )locale=([^;]+)/);
    const c = m ? decodeURIComponent(m[1]) : '';
    if (c === 'en' || c === 'uk') return c;
  }
  return 'uk';
}

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const msgs: Messages = locale === 'en' ? en : uk;

  const value = useMemo(() => ({ locale, messages: msgs, setLocale }), [locale, msgs]);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

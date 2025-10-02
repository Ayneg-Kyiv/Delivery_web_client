"use client";

import React, { useEffect, useState } from 'react';
import { setCookie, getCookie } from '@/utils/cookies';
import { useI18n } from '@/i18n/I18nProvider';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const { messages: t } = useI18n();

  useEffect(() => {
    // Check if consent cookie exists
    const consentGiven = getCookie('cookie-consent');
    if (!consentGiven) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    // Set consent cookie for 365 days
    setCookie('cookie-consent', 'true', 365);
    setVisible(false);
    
    // Initialize analytics or other cookie-dependent features
    initializeCookieDependentServices();
  };

  const declineCookies = () => {
    // Set minimal consent (only necessary cookies)
    setCookie('cookie-consent', 'minimal', 365);
    setVisible(false);
  };

  const initializeCookieDependentServices = () => {
    // Add code to initialize analytics, etc.
    console.log('Initializing services that depend on cookies');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a093a] text-white p-4 shadow-lg z-50 border-t border-[#724C9D]">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold mb-2">{t.cookieBanner.title}</h3>
          <p className="text-sm opacity-90">{t.cookieBanner.description}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 bg-transparent border border-[#724C9D] rounded hover:bg-[#724C9D]/20"
          >
            {t.cookieBanner.decline}
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 bg-[#724C9D] rounded hover:bg-[#5d3b80]"
          >
            {t.cookieBanner.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
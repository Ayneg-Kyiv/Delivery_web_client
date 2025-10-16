"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AuthService } from "@/app/auth-service";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import dynamic from 'next/dynamic';

type BurgerMenuProps = {
  onClose?: () => void;
};

export default function BurgerMenu({ onClose }: BurgerMenuProps): React.JSX.Element {

  const { data: session } = useSession();
  const router = useRouter();
  const { messages: t } = useI18n();
  const LanguageSwitcher = dynamic(() => import('@/components/language-switcher'), { ssr: false });

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) onClose?.();
  };
  
  const handleSignOut = async () => {
    await AuthService.logout();
    router.push('/');
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal
      onClick={handleBackdropClick}
    >
      <div className="absolute right-0 top-0 h-full w-[90vw] max-w-[420px] bg-[#130c1f] text-white shadow-2xl border-l border-white/10 flex flex-col">
        <div className=" flex  items-center justify-between p-4 border-b border-white/10 shrink-0">
          <span className="text-xl font-semibold">{t.nav.menuTitle}</span>
          <button
            onClick={onClose}
            aria-label={t.nav.closeMenu}
            className="w-9 h-9 rounded-md hover:bg-white/10 flex items-center justify-center text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <nav className="p-4 space-y-1 md:space-y-2 flex-1 overflow-y-auto flex flex-col">
      { session?.user && (
            <>
              <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/profile" onClick={onClose}>
                {t.nav.profile}
              </Link>
              <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/delivery/request/list" onClick={onClose}>
                {t.nav.items.ordersBoard}
              </Link>
              <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/delivery/trip/list" onClick={onClose}>
                {t.nav.items.tripsList}
              </Link>
            </>
          )}

          <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/about" onClick={onClose}>
            {t.nav.items.about}
          </Link>
          <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/policy" onClick={onClose}>
            {t.nav.items.policy}
          </Link>
          <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/help" onClick={onClose}>
            {t.nav.items.helpCenter}
          </Link>
          <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/news" onClick={onClose}>
            {t.nav.items.news}
          </Link>
          <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/terms" onClick={onClose}>
            {t.nav.items.terms}
          </Link>
          <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/help" onClick={onClose}>
            {t.nav.items.help}
          </Link>
          <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/help/driver" onClick={onClose}>
            {t.nav.items.helpDriver}
          </Link>
          <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/help/sender" onClick={onClose}>
            {t.nav.items.helpSender}
          </Link>
          

          {
            session?.user?.roles.includes('Admin') && (
              <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/profile/admin-panel" onClick={onClose}>
                {t.nav.items.adminPanel}
              </Link>
            )
          }
          { !session?.user && (
            <>
              <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/signin" onClick={onClose}>
                {t.nav.items.signIn}
              </Link>
              <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/signup" onClick={onClose}>
                {t.nav.items.signUp}
              </Link>
            </>
          )}

          <div className="flex-1 flex flex-col justify-end">

            { session?.user && (
              <button
              className="block px-3 py-2 rounded-md hover:bg-white/10 w-full text-left mt-6"
              onClick={() => { handleSignOut(); onClose?.(); }}
              >
                {t.nav.logout}
              </button>
            )}

            {/* Language Switcher for mobile menu */}
            <div className="mt-6 pt-4 border-t border-white/10 md:hidden">
              <div className="text-xs text-white/70 mb-2">Мова / Language</div>
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
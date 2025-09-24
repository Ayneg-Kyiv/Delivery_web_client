"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AuthService } from "@/app/auth-service";
import { useRouter } from "next/navigation";

type BurgerMenuProps = {
  onClose?: () => void;
};

export default function BurgerMenu({ onClose }: BurgerMenuProps): React.JSX.Element {

  const { data: session } = useSession();
  const router = useRouter();

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
      <div className="absolute right-0 top-0 h-full w-[90vw] max-w-[420px] bg-[#130c1f] text-white shadow-2xl border-l border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-xl font-semibold">Меню</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 rounded-md hover:bg-white/10 flex items-center justify-center text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <nav className="p-4 space-y-1">
          { session?.user && (
            <>
              <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/profile" onClick={onClose}>
                Профіль
              </Link>
              <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/" onClick={onClose}>
                Дошка замовлення
              </Link>
            </>
          )}
          <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/about" onClick={onClose}>
            Про нас
          </Link>
          <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/policy" onClick={onClose}>
            Політика
          </Link>
          { !session?.user && (
            <Link className="block px-3 py-2 rounded-md hover:bg-white/10" href="/signin" onClick={onClose}>
              Увійти
            </Link>
          )}

          { session?.user && (
              <button className="block px-3 py-2 rounded-md hover:bg-white/10 w-full text-left absolute bottom-4" onClick={() => { handleSignOut(); onClose?.(); }}>
                Вийти
              </button>
          )}
        </nav>
      </div>
    </div>
  );
}

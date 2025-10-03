"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Button from './ui/button';
import dynamic from 'next/dynamic';
import { useI18n } from '@/i18n/I18nProvider';

const BurgerMenu = dynamic(() => import('./burger-menu'), { ssr: false });
const LanguageSwitcher = dynamic(() => import('@/components/language-switcher'), { ssr: false });

export default function Navbar() {
  const pathname = usePathname();
  const { messages: t } = useI18n();

  const [windowWidth, setWindowWidth] = React.useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((open) => !open);

  useEffect(() => {
    // console.log(session);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Language handled by LanguageSwitcher component

  const authNavigation = (
    <nav className="h-[78px] w-screen w-full ">
      <div className="h-full mx-auto flex items-center justify-between">
        
        <div className='h-full flex items-center justify-between '>
          <Link href="/" className="pl-8 md:pl-10 lg:pl-[190px]">
            <Image src='/logo/Logo.png' alt={t.nav.logoAlt} width={129} height={36}/>
          </Link>
        </div>

        <div className='h-full flex items-center justify-between pr-8 md:pr-10 lg:pr-[190px]'>
          <LanguageSwitcher />

          <div className='flex items-center'>
            <Link href='/help' className='ml-[20px] px-4 h-9 rounded-xl flex items-center justify-center border border-solid border-white hover:bg-white hover:text-[#2c1b48] transition-colors duration-200 cursor-pointer'>{t.nav.help}</Link>
            { 
              session?.user && (
                <>
                  <p className='ml-[20px]'>{session.user.email}</p>
                  <Link href='/profile' className='ml-[20px] w-9 h-9 rounded-[20px] flex items-center justify-center cursor-pointer bg-darker'>
                    <Image src='/profile-icon.png' alt={t.nav.profileAlt} width={16} height={16} />
                  </Link>
                </>
            )}
          </div>

          {/* Burger button for mobile */}
            <button
              className="ml-[20px] text-3xl focus:outline-none"
              onClick={handleMenuToggle}
              aria-label={t.nav.toggleMenu}>
              &#9776;
            </button>
          </div>

      </div>
      <div className='h-[2px] navbar-underline z-10' />
    </nav>
  );

  const standardNavigation = (
    <nav className="h-[78px] max-w-screen w-full items-center">
      <div className="h-full mx-auto flex items-center justify-between">
        
        <div className='h-full flex items-center justify-between '>
          <Link href="/" className="pl-8 md:pl-10 lg:pl-[190px]">
            <Image src='/logo/Logo.png' alt={t.nav.logoAlt} width={129} height={36}/>
          </Link>
        </div>

          <div className='h-full flex items-center justify-between pr-8 md:pr-10 lg:pr-[190px]'>
          <LanguageSwitcher />

          <div className='flex items-center '>
            <Link href='/help' className='ml-[10px] px-4 h-9 rounded-xl flex items-center justify-center border border-solid border-white hover:bg-white hover:text-[#2c1b48] transition-colors duration-200 cursor-pointer'>{t.nav.help}</Link>

            { 
              session?.user && (
                <>
                  <p className='ml-[20px]'>{session.user.email}</p>
                  <Link href='/profile' className='ml-[20px] w-9 h-9 rounded-[20px] flex items-center justify-center cursor-pointer bg-darker'>
                    <Image src='/profile-icon.png' alt='Profile' width={16} height={16} />
                  </Link>
                </>
            )}
            {
              !session?.user && (
                <>
                  <Link href='/signup' className='ml-[20px] px-4 h-9 rounded-xl flex items-center justify-center border border-solid border-white hover:bg-white hover:text-[#2c1b48] transition-colors duration-200 cursor-pointer'>{t.nav.register}</Link>
                  <Link href='/signin' className='ml-[20px] px-8 h-9 rounded-xl flex items-center justify-center  button-type-3'>{t.nav.login}</Link>
                </>
            )}
          </div>

          <button
            className="ml-[20px] text-3xl focus:outline-none"
            onClick={handleMenuToggle}
            aria-label={t.nav.toggleMenu}>
            &#9776;
          </button>
        </div>
      </div>
      <div className='h-[2px] navbar-underline z-10' />
    </nav>
  );

  const phoneNavigation =  (
    <>
      <nav className="h-[78px] max-w-screen w-full flex items-center">
        <div className='flex flex-1 flex-row justify-between h-full'>
          
          <div className='flex-1 h-full flex items-center justify-between pl-[20px]'>
            <Link href="/" className="">
              <Image src='/logo/Logo.png' alt={t.nav.logoAlt} width={129} height={36}/>
            </Link>
          </div>

          <div className=' h-full flex items-center justify-between pr-[20px]'>
            <button
              className="ml-[10px] text-3xl focus:outline-none"
              onClick={handleMenuToggle}
              aria-label={t.nav.toggleMenu}>
              &#9776;
            </button>
          </div>
        </div>
      </nav>
      <div className='h-[2px] navbar-underline z-10' />
    </>
  );

  return (
    <div>
      <div className='hidden md:block'>{
        (pathname === '/signin' || pathname === '/signup') ? authNavigation : standardNavigation}</div>
      <div className='md:hidden'>{phoneNavigation}</div>

      {menuOpen && <BurgerMenu onClose={() => setMenuOpen(false)} />}
    </div>
  )
}
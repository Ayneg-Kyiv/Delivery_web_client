"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Button from './ui/button';
import dynamic from 'next/dynamic';

const BurgerMenu = dynamic(() => import('./burger-menu'), { ssr: false });

export default function Navbar() {
  const pathname = usePathname();

  const [windowWidth, setWindowWidth] = React.useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

  const handleMenuToggle = () => setMenuOpen((open) => !open);

  useEffect(() => {
    console.log(session);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    console.log(`Language changed to: ${langCode}`);
  };

  const authNavigation = (
    <nav className="h-[78px] w-screen w-full ">
      <div className="h-full mx-auto flex items-center justify-between">
        
        <div className='h-full flex items-center justify-between '>
          <Link href="/" className="pl-8 md:pl-10 lg:pl-[190px]">
            <Image src='/logo/Logo.png' alt="Logo" width={129} height={36}/>
          </Link>
        </div>

        <div className='h-full flex items-center justify-between pr-8 md:pr-10 lg:pr-[190px]'>
          <div className="flex items-center gap-2">
            <Button className="flex items-center" onClick={() => handleLanguageChange("EN")} text=''>
              <div className="w-[30px] h-[22px] icon-light-blue rounded-md flex items-center justify-center">
                <Image width={14} height={14} alt="English flag" src="/worldicon.png" />
              </div>
              <span className="ml-2 [font-family:'Bahnschrift-Regular',Helvetica] text-[#c5c2c2] text-base">
                EN
              </span>
            </Button>
          
            <div className="h-7 bg-white/20 w-[2px] rounded-sm" />

            <Button className="flex items-center" onClick={() => handleLanguageChange("UA")} text=''>
              <div className="w-[30px] h-[22px] icon-light-yellow rounded-md overflow-hidden">
                <div className="h-[11px] icon-light-blue rounded-[6px_6px_0px_0px]" />
              </div>
              <span className="ml-2 [font-family:'Bahnschrift-Regular',Helvetica] text-base">
                UA
              </span>
            </Button>
          </div>

          <div className='flex items-center'>
            <Link href='/help' className='ml-[20px] px-4 h-9 rounded-xl flex items-center justify-center border border-solid border-white hover:bg-white hover:text-[#2c1b48] transition-colors duration-200 cursor-pointer'>Допомога</Link>
            { 
              session?.user && (
                <>
                  <p className='ml-[20px]'>{session.user.email}</p>
                  <Link href='/profile' className='ml-[20px] w-9 h-9 rounded-[20px] flex items-center justify-center cursor-pointer bg-darker'>
                    <Image src='/profile-icon.png' alt='Profile' width={16} height={16} />
                  </Link>
                </>
            )}
          </div>

          {/* Burger button for mobile */}
            <button
              className="ml-[20px] text-3xl focus:outline-none"
              onClick={handleMenuToggle}
              aria-label="Toggle menu">
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
            <Image src='/logo/Logo.png' alt="Logo" width={129} height={36}/>
          </Link>
        </div>

        <div className='h-full flex items-center justify-between pr-8 md:pr-10 lg:pr-[190px]'>
          <div className="flex items-center ">
            <Button className="flex items-center" onClick={() => handleLanguageChange("EN")} text=''>
              <div className="w-[30px] h-[22px] icon-light-blue rounded-md flex items-center justify-center">
                <Image width={14} height={14} alt="English flag" src="/worldicon.png" />
              </div>
              <span className="ml-2 [font-family:'Bahnschrift-Regular',Helvetica] text-[#c5c2c2] text-base">
                EN
              </span>
            </Button>
          
            <div className="h-7 bg-white/20 w-[2px] rounded-sm" />

            <Button className="flex items-center" onClick={() => handleLanguageChange("UA")} text=''>
              <div className="w-[30px] h-[22px] icon-light-yellow rounded-md overflow-hidden">
                <div className="h-[11px] icon-light-blue rounded-[6px_6px_0px_0px]" />
              </div>
              <span className="ml-2 [font-family:'Bahnschrift-Regular',Helvetica] text-base">
                UA
              </span>
            </Button>
          </div>

          <div className='flex items-center '>
            <Link href='/help' className='ml-[10px] px-4 h-9 rounded-xl flex items-center justify-center border border-solid border-white hover:bg-white hover:text-[#2c1b48] transition-colors duration-200 cursor-pointer'>Допомога</Link>

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
                  <Link href='/signup' className='ml-[20px] px-4 h-9 rounded-xl flex items-center justify-center border border-solid border-white hover:bg-white hover:text-[#2c1b48] transition-colors duration-200 cursor-pointer'>Реєстрація</Link>
                  <Link href='/signin' className='ml-[20px] px-8 h-9 rounded-xl flex items-center justify-center  button-type-3'>Вхід</Link>
                </>
            )}
          </div>

          <button
            className="ml-[20px] text-3xl focus:outline-none"
            onClick={handleMenuToggle}
            aria-label="Toggle menu">
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
              <Image src='/logo/Logo.png' alt="Logo" width={129} height={36}/>
            </Link>
          </div>

          <div className=' h-full flex items-center justify-between pr-[20px]'>
            <button
              className="ml-[10px] text-3xl focus:outline-none"
              onClick={handleMenuToggle}
              aria-label="Toggle menu">
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
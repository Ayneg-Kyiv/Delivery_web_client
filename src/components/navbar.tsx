"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AuthService } from '../app/auth-service';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Button from './ui/button';
import dynamic from 'next/dynamic';

const BurgerMenu = dynamic(() => import('./burger-menu'), { ssr: false });

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

  const handleMenuToggle = () => setMenuOpen((open) => !open);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await AuthService.logout();
    router.push('/');
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    console.log(`Language changed to: ${langCode}`);
  };

  const handleHelpClick = () => {
    // Help functionality can be implemented here
    console.log("Help clicked");
  };

  const authNavigation = (
    <nav className="h-[78px] max-w-screen w-full ">
      <div className="h-full mx-auto flex items-center justify-between">
        
        <div className='h-full flex items-center justify-between '>
          <Link href="/" className="pl-[190px]">
            <Image src='/logo/Logo.png' alt="Logo" width={129} height={36}/>
          </Link>
        </div>

        <div className='h-full flex items-center justify-between pr-[190px]'>
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
            <Button text='Help' onClick={handleHelpClick} className='ml-[20px] w-[79px] h-9 rounded-xl border border-solid border-white hover:bg-white hover:text-[#2c1b48] transition-colors duration-200 cursor-pointer' />
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
      <div className='h-[2px] navbar-underline' />
    </nav>
  );

  const standardNavigation = (
    <nav className="h-[78px] max-w-screen w-full ">
      
      <div className="h-full mx-auto flex items-center justify-between">
        
        <div className='h-full flex items-center justify-between '>
          <Link href="/" className="pl-[190px]">
            <Image src='/logo/Logo.png' alt="Logo" width={129} height={36}/>
          </Link>
        </div>

        <div className='h-full flex items-center justify-between pr-[190px]'>
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
            <Button text='Help' onClick={handleHelpClick} className='ml-[20px] w-[79px] h-9 rounded-xl border border-solid border-white hover:bg-white hover:text-[#2c1b48] transition-colors duration-200 cursor-pointer' />
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
      <div className='h-[2px] navbar-underline' />
    </nav>
  );

  return (
    <>
      {pathname === '/signin' || pathname === '/signup' ? (
        authNavigation
      ) : (
        standardNavigation
      )}
      {menuOpen && <BurgerMenu onClose={() => setMenuOpen(false)} />}
    </>
  )
}
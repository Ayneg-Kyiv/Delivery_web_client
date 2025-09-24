import React from "react";
import Image from 'next/image'
import Link from "next/link";

const Footer: React.FC = () => (
  <footer className="w-full  px-8 md:px-8 lg:px-[190px] footer">
    <div className="flex-1 flex flex-col " >

      <div className="w-full flex flex-col ">
        {/* Image href */}
        <div className='h-full flex items-center pt-4 pb-2'>
          <Link href="/" className="py-4">
            <Image src='/logo/Logo.png' alt="Logo" width={129} height={36}/>
          </Link>
        </div>

        {/* href's to most common pages on the site */}
        <div className="flex flex-col md:flex-row lg:flex-row md:lg:justify-between  gap-8 pb-10">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Сервіс</h2>

            <div className="flex flex-col text-lg fg-secondary">
              <Link href="/about" className="">Про нас</Link>
              <Link href="/policy" className="mt-2">Політика конфіденційності</Link>
              <Link href="/terms" className="mt-2">Умови користування</Link>
            </div>
          </div>
          
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Сервіс</h2>

            <div className="flex flex-col text-lg fg-secondary">
              <Link href="/about" className="">Про нас</Link>
              <Link href="/policy" className="mt-2">Політика конфіденційності</Link>
              <Link href="/terms" className="mt-2">Умови користування</Link>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">Сервіс</h2>

            <div className="flex flex-col text-lg fg-secondary">
              <Link href="/about" className="">Про нас</Link>
              <Link href="/policy" className="mt-2">Політика конфіденційності</Link>
              <Link href="/terms" className="mt-2">Умови користування</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex flex-col md:space-y-2 items-center justify-center h-full mb-4">
        <div className="w-full h-[1px] bg-white/20 rounded-sm mb-4"></div>
        
        <div className="w-full flex md:flex-row justify-between">
          <div className="w-full flex flex-col md:flex-row md:space-x-4 items-center justify-center md:justify-between text-center fg-secondary text-sm">
            <div className="flex md:h-[45px] items-end">
              <p>
                © 2025 Cargix.
              </p>
            </div>

            <div className="flex h-[45px] space-x-2 md:space-x-4 items-end">
              <Link href="/terms">Умови користування</Link>
              <Link href="/cookies">Кукі</Link>
              <Link href="/policy">Політика</Link>
              <Link href="/security">Безпека</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
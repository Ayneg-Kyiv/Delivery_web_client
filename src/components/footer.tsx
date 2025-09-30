"use client";

import React from "react";
import Image from 'next/image'
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

const Footer: React.FC = () => {
  const { messages: t } = useI18n();

  return (
  <footer className="w-full  px-8 md:px-8 lg:px-[190px] footer">
    <div className="flex-1 flex flex-col " >

      <div className="w-full flex flex-col ">
        {/* Image href */}
        <div className='h-full flex flex-col items-start pt-4 pb-10'>
          <Link href="/" className="py-4">
            <Image src='/logo/Logo.png' alt="Logo" width={129} height={36}/>
          </Link>

          <Link href="/help" className="underline text-lg fg-secondary ">
            {t.footer.helpCenter}
          </Link>
        </div>

        {/* href's to most common pages on the site */}
        <div className="flex flex-col md:flex-row lg:flex-row md:lg:justify-between  gap-8 pb-10">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">{t.footer.delivery}</h2>

            <div className="flex flex-col text-lg fg-secondary">
                <Link href="/#calculate-delivery" className="">{t.footer.calculateCost}</Link>
              <Link href="/delivery/request/list" className="mt-2">{t.footer.requestList}</Link>
              <Link href="/delivery/trip/list" className="mt-2">{t.footer.tripList}</Link>
            </div>
          </div>
          
          <div>
            <h2 className="mb-2 text-2xl font-semibold">{t.footer.features}</h2>

            <div className="flex flex-col text-lg fg-secondary">
              <Link href="/news" className="">{t.footer.latestNews}</Link>
              <Link href="/policy" className="mt-2">{t.footer.privacyPolicy}</Link>
              <Link href="/terms" className="mt-2">{t.footer.termsOfUse}</Link>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">{t.footer.service}</h2>

            <div className="flex flex-col text-lg fg-secondary">
              <Link href="/about" className="">{t.footer.aboutUs}</Link>
              <Link href="/policy" className="mt-2">{t.footer.privacyPolicy}</Link>
              <Link href="/terms" className="mt-2">{t.footer.termsOfUse}</Link>
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
                {t.footer.copyright}
              </p>
            </div>

            <div className="flex h-[45px] space-x-2 md:space-x-4 items-end">
              <Link href="/terms">{t.footer.termsOfUse}</Link>
              <Link href="/cookies">{t.footer.cookies}</Link>
              <Link href="/policy">{t.footer.policy}</Link>
              <Link href="/policy#data-collected">{t.footer.security}</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </footer>
  )
};

export default Footer;
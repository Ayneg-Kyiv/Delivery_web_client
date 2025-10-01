'use client'

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

export default function CookiesPage(): React.JSX.Element {
    const { messages: t } = useI18n();

    return (
        <div className='flex-1 flex-col w-full flex py-20 px-8 md:px-20 lg:px-40'>
            <div className='w-full flex flex-row'>
                <Link href='/' className=' hover:underline pr-4'>{t.articlePage.breadcrumb.home}</Link>
                <p>{' > '}</p>
                <Link href='/news' className='pl-4 hover:underline'>{t.cookiesPage.breadcrumbTitle}</Link>
            </div>
            <div className='flex-1 w-full flex flex-col pt-6]'>
                <h1 className='text-[40px] md:text-5xl font-bold pt-10'>{t.cookiesPage.title}</h1>
                
                <p className='text-xl pt-10'>
                    {t.cookiesPage.intro1}
                </p>

                <p className='text-xl pt-4'>
                    {t.cookiesPage.lastUpdated}
                </p>

                <p className='text-2xl pt-4'>
                    {t.cookiesPage.intro2}
                </p>
                <p className='text-2xl pt-2'>
                    {t.cookiesPage.intro3}
                </p>
            </div>
            <div className='flex-1 w-full flex flex-col pt-6'>
                <h1 className='text-[40px] md:text-5xl font-bold pt-10'>{t.cookiesPage.tech.title}</h1>
                <p className='text-2xl pt-10'>
                    {t.cookiesPage.tech.intro}
                </p>
                <ul className='pl-10 pt-4 text-xl list-disc space-y-4 md:space-y-2'>
                    <li>{t.cookiesPage.tech.list.cookies}</li>
                    <li>{t.cookiesPage.tech.list.pixelTags}</li>
                    <li>{t.cookiesPage.tech.list.sdks}</li>
                    <li>{t.cookiesPage.tech.list.localStorage}</li>
                </ul>
            </div>
            <div className='flex-1 w-full flex flex-col pt-6 '>
                <h1 className='text-[40px] md:text-5xl font-bold pt-10'>{t.cookiesPage.howWeUse.title}</h1>
                <p className='text-2xl pt-10'>
                    {t.cookiesPage.howWeUse.intro}
                </p>

                <div className='flex-1 w-full flex flex-col py-10 gap-y-8 md:hidden'>
                    <div className='flex flex-col gap-y-8 '>
                        <div className='text-[24px]'>
                            {t.cookiesPage.howWeUse.prefixes.category} {t.cookiesPage.howWeUse.categories.necessary.title}
                        </div>
                        <div className='text-[20px]'>
                            {t.cookiesPage.howWeUse.prefixes.purpose} {t.cookiesPage.howWeUse.categories.necessary.purpose}
                        </div>
                        <div className='text-[20px]'>
                            {t.cookiesPage.howWeUse.prefixes.owner} {t.cookiesPage.howWeUse.categories.necessary.owner}
                        </div>

                        <div className='w-full h-[1px] bg-lighter'></div>
                    </div>
                    <div className='flex flex-col gap-y-8 '>
                        <div className='text-[24px]'>
                            {t.cookiesPage.howWeUse.prefixes.category} {t.cookiesPage.howWeUse.categories.analytics.title}
                        </div>
                        <div className='text-[20px]'>
                            {t.cookiesPage.howWeUse.prefixes.purpose} {t.cookiesPage.howWeUse.categories.analytics.purpose}
                        </div>
                        <div className='text-[20px]'>
                            {t.cookiesPage.howWeUse.prefixes.owner} {t.cookiesPage.howWeUse.categories.analytics.owner}
                        </div>

                        <div className='w-full h-[1px] bg-lighter'></div>
                    </div>
                    <div className='flex flex-col gap-y-8 '>
                        <div className='text-[24px]'>
                            {t.cookiesPage.howWeUse.prefixes.category} {t.cookiesPage.howWeUse.categories.advertising.title}
                        </div>
                        <div className='text-[20px]'>
                            {t.cookiesPage.howWeUse.prefixes.purpose} {t.cookiesPage.howWeUse.categories.advertising.purpose}
                        </div>
                        <div className='text-[20px]'>
                            {t.cookiesPage.howWeUse.prefixes.owner} {t.cookiesPage.howWeUse.categories.advertising.owner}
                        </div>
                    </div>
                </div>

                <div className='hidden md:block'>
                    <table className='w-full text-left mt-10'>
                        <thead>
                            <tr>
                                <th className='border-t w-[20%] border[rgba(29,29,29,1)] px-4 py-2'>{t.cookiesPage.howWeUse.tableHeaders.category}</th>
                                <th className='border-t border[rgba(29,29,29,1)] px-4 py-2'>{t.cookiesPage.howWeUse.tableHeaders.purpose}</th>
                                <th className='border-t w-[10%] border[rgba(29,29,29,1)] px-4 py-2'>{t.cookiesPage.howWeUse.tableHeaders.owner}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='border-t border[rgba(29,29,29,1)] px-4 py-2'>{t.cookiesPage.howWeUse.categories.necessary.title}</td>
                                <td className='border-t border[rgba(29,29,29,1)] px-4 py-2'>{t.cookiesPage.howWeUse.categories.necessary.purpose}</td>
                                <td className='border-t border[rgba(29,29,29,1)] px-4 py-2'>{t.cookiesPage.howWeUse.categories.necessary.owner}</td>
                            </tr>
                            <tr>
                                <td className='border-t border[rgba(29,29,29,1)] px-4 py-2'>{t.cookiesPage.howWeUse.categories.analytics.title}</td>
                                <td className='border-t border[rgba(29,29,29,1)] px-4 py-2'>{t.cookiesPage.howWeUse.categories.analytics.purpose}</td>
                                <td className='border-t border[rgba(29,29,29,1)] px-4 py-2'>{t.cookiesPage.howWeUse.categories.analytics.owner}</td>
                            </tr>
                            <tr>
                                <td className='border-t border[rgba(29,29,29,1)] px-4 py-2'>{t.cookiesPage.howWeUse.categories.advertising.title}</td>
                                <td className='border-t border[rgba(29,29,29,1)] px-4 py-2'>{t.cookiesPage.howWeUse.categories.advertising.purpose}</td>
                                <td className='border-t border[rgba(29,29,29,1)] px-4 py-2'>{t.cookiesPage.howWeUse.categories.advertising.owner}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
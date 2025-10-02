'use client'

import React, { Component } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

class CookiesPage extends Component<{ t: any; language: string }> {
    render() {
        const t = this.props.t.cookiesPage;
        const homeLabel = this.props.t.articlePage?.breadcrumb?.home ?? 'Home';
        const localeTag = this.props.language === 'uk' ? 'uk-UA' : 'en-US';
        const formattedDate = new Date().toLocaleDateString(localeTag);
        return (
            <div className='flex-1 flex-col w-full flex py-20 px-8 md:px-20 lg:px-40'>
                <div className='w-full flex flex-row'>
                    <Link href='/' className=' hover:underline pr-4'>{homeLabel}</Link>
                    <p>{' > '}</p>
                    <Link href='/cookies' className='pl-4 hover:underline'>{t.breadcrumbTitle}</Link>
                </div>
                <div className='flex-1 w-full flex flex-col pt-6]'>
                    <h1 className='text-[40px] md:text-5xl font-bold pt-10'>{t.title}</h1>
                    <p className='text-xl pt-10'>{t.intro1}</p>
                    <p className='text-xl pt-4'>{t.lastUpdated.replace('{date}', formattedDate)}</p>
                    <p className='text-2xl pt-4'>{t.intro2}</p>
                    <p className='text-2xl pt-2'>{t.intro3}</p>
                </div>
                <div className='flex-1 w-full flex flex-col pt-6'>
                    <h1 className='text-[40px] md:text-5xl font-bold pt-10'>{t.tech.title}</h1>
                    <p className='text-2xl pt-10'>{t.tech.intro}</p>
                    <ul className='pl-10 pt-4 text-xl list-disc space-y-4 md:space-y-2'>
                        <li>{t.tech.list.cookies}</li>
                        <li>{t.tech.list.pixelTags}</li>
                        <li>{t.tech.list.sdks}</li>
                        <li>{t.tech.list.localStorage}</li>
                    </ul>
                </div>
                <div className='flex-1 w-full flex flex-col pt-6 '>
                    <h1 className='text-[40px] md:text-5xl font-bold pt-10'>{t.howWeUse.title}</h1>
                    <p className='text-2xl pt-10'>{t.howWeUse.intro}</p>

                    <div className='flex-1 w-full flex flex-col py-10 gap-y-8 md:hidden'>
                        <div className='flex flex-col gap-y-8 '>
                            <div className='text-[24px]'>
                                {t.howWeUse.prefixes.category} {t.howWeUse.categories.necessary.title}
                            </div>
                            <div className='text-[20px]'>
                                {t.howWeUse.prefixes.purpose} {t.howWeUse.categories.necessary.purpose}
                            </div>
                            <div className='text-[20px]'>
                                {t.howWeUse.prefixes.owner} {t.howWeUse.categories.necessary.owner}
                            </div>

                            <div className='w-full h-[1px] bg-lighter'></div>
                        </div>
                        <div className='flex flex-col gap-y-8 '>
                            <div className='text-[24px]'>
                                {t.howWeUse.prefixes.category} {t.howWeUse.categories.analytics.title}
                            </div>
                            <div className='text-[20px]'>
                                {t.howWeUse.prefixes.purpose} {t.howWeUse.categories.analytics.purpose}
                            </div>
                            <div className='text-[20px]'>
                                {t.howWeUse.prefixes.owner} {t.howWeUse.categories.analytics.owner}
                            </div>

                            <div className='w-full h-[1px] bg-lighter'></div>
                        </div>
                        <div className='flex flex-col gap-y-8 '>
                            <div className='text-[24px]'>
                                {t.howWeUse.prefixes.category} {t.howWeUse.categories.advertising.title}
                            </div>
                            <div className='text-[20px]'>
                                {t.howWeUse.prefixes.purpose} {t.howWeUse.categories.advertising.purpose}
                            </div>
                            <div className='text-[20px]'>
                                {t.howWeUse.prefixes.owner} {t.howWeUse.categories.advertising.owner}
                            </div>
                        </div>
                    </div>

                    <div className='hidden md:block'>
                        <table className='w-full text-left mt-10'>
                            <thead>
                                <tr>
                                    <th className='border-t w-[20%] border-[rgba(29,29,29,1)] px-4 py-2'>{t.howWeUse.tableHeaders.category}</th>
                                    <th className='border-t border-[rgba(29,29,29,1)] px-4 py-2'>{t.howWeUse.tableHeaders.purpose}</th>
                                    <th className='border-t w-[10%] border-[rgba(29,29,29,1)] px-4 py-2'>{t.howWeUse.tableHeaders.owner}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className=''>
                                    <td className='border-t border-[rgba(29,29,29,1)] px-4 py-2'>{t.howWeUse.categories.necessary.title}</td>
                                    <td className='border-t border-[rgba(29,29,29,1)] px-4 py-2'>{t.howWeUse.categories.necessary.purpose}</td>
                                    <td className='border-t border-[rgba(29,29,29,1)] px-4 py-2'>{t.howWeUse.categories.necessary.owner}</td>
                                </tr>

                                <tr>
                                    <td className='border-t border-[rgba(29,29,29,1)] px-4 py-2'>{t.howWeUse.categories.analytics.title}</td>
                                    <td className='border-t border-[rgba(29,29,29,1)] px-4 py-2'>{t.howWeUse.categories.analytics.purpose}</td>
                                    <td className='border-t border-[rgba(29,29,29,1)] px-4 py-2'>{t.howWeUse.categories.analytics.owner}</td>
                                </tr>

                                <tr>
                                    <td className='border-t border-[rgba(29,29,29,1)] px-4 py-2'>{t.howWeUse.categories.advertising.title}</td>
                                    <td className='border-t border-[rgba(29,29,29,1)] px-4 py-2'>{t.howWeUse.categories.advertising.purpose}</td>
                                    <td className='border-t border-[rgba(29,29,29,1)] px-4 py-2'>{t.howWeUse.categories.advertising.owner}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const CookiesPageWrapper = (props: any) => {
    const { messages, language } = useI18n();
    return <CookiesPage {...props} t={messages} language={language} />;
};

export default CookiesPageWrapper;
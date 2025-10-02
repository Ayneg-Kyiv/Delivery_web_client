"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useI18n } from '@/i18n/I18nProvider';

const titleCls = "font-['Bahnschrift-SemiBold',Helvetica] text-white text-3xl md:text-4xl mb-6 text-center";
const paragraph = "text-[#e4e4e4] leading-relaxed text-sm md:text-base";
const wrapper = "bg-[#2c1b48] border border-[#3d2a5a] rounded-2xl p-8 md:p-12 space-y-6";
const subtle = "text-[#b8b4c2]";
const accent = "text-[#c84cd8]";

// TODO: замініть назву компанії на фактичну юридичну (ФОП / ТОВ)
const COMPANY_NAME = "ТОВ \"Delivery Platform\"";

export default function PolicyPage(): React.JSX.Element {
    const { data: session } = useSession();
    const { messages, language } = useI18n();
    const t = messages.policy;
    const localeTag = language === 'uk' ? 'uk-UA' : 'en-US';
    const formattedDate = new Date().toLocaleDateString(localeTag);

    return (
        <main className="bg-[#130c1f] w-full flex justify-center text-white py-16 px-8 md:px-10 lg:px-20">
            <div className="w-full max-w-5xl space-y-16">
                {/* Hero */}
                <header className="text-center space-y-6">
                    <h1 className="font-['Bahnschrift-SemiBold',Helvetica] text-4xl md:text-5xl leading-tight">
                        {t.title}
                    </h1>
                    <p className={`${paragraph} max-w-3xl mx-auto`}>{t.subtitle}</p>
                    <p className="text-xs uppercase tracking-wider text-[#8d819f]">{t.lastUpdated.replace('{date}', formattedDate)}</p>
                </header>

                {/* 1. General */}
                <section className={wrapper} id="general">
                    <h2 className={titleCls}>{t.general.title}</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}>{t.general.p1.replace('{companyName}', COMPANY_NAME)}</p>
                        <p className={paragraph}>{t.general.p2}</p>
                        <p className={`${paragraph} ${subtle}`}>{t.general.p3}</p>
                    </div>
                </section>

                {/* 2. Data collected */}
                <section className={wrapper} id="data-collected">
                    <h2 className={titleCls}>{t.dataCollected.title}</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">{t.dataCollected.personal.title}</h3>
                            <ul className="space-y-2 text-left inline-block">
                                {t.dataCollected.personal.items.map((it: string) => (
                                  <li key={it} className={paragraph}>{it}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">{t.dataCollected.technical.title}</h3>
                            <ul className="space-y-2 text-left inline-block">
                                {t.dataCollected.technical.items.map((it: string) => (
                                  <li key={it} className={paragraph}>{it}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">{t.dataCollected.behavioral.title}</h3>
                            <ul className="space-y-2 text-left inline-block">
                                {t.dataCollected.behavioral.items.map((it: string) => (
                                  <li key={it} className={paragraph}>{it}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <p className={`${paragraph} text-center pt-4`}>{t.dataCollected.p1}</p>
                </section>

                {/* 3. Usage of data */}
                <section className={wrapper} id="usage">
                    <h2 className={titleCls}>{t.usage.title}</h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-6 text-center">
                            <h3 className="font-semibold text-lg">{t.usage.services.title}</h3>
                            <p className={paragraph}>{t.usage.services.p1}</p>
                            <h3 className="font-semibold text-lg">{t.usage.communication.title}</h3>
                            <p className={paragraph}>{t.usage.communication.p1}</p>
                        </div>
                        <div className="space-y-6 text-center">
                            <h3 className="font-semibold text-lg">{t.usage.analytics.title}</h3>
                            <p className={paragraph}>{t.usage.analytics.p1}</p>
                            <h3 className="font-semibold text-lg">{t.usage.marketing.title}</h3>
                            <p className={paragraph}>{t.usage.marketing.p1}</p>
                        </div>
                    </div>
                    <p className={`${paragraph} text-center pt-4`}>{t.usage.p1}</p>
                </section>

                {/* CTA only if not logged in */}
                {!session && (
                    <section className={`${wrapper} bg-[#342154]`}>
                        <h2 className={titleCls}>{t.cta.title}</h2>
                        <p className={`${paragraph} text-center max-w-xl mx-auto`}>{t.cta.p1}</p>
                        <div className="flex justify-center pt-2">
                            <a href="/signup" className="inline-flex items-center justify-center h-12 px-10 rounded-lg bg-[#7f51b3] hover:bg-[#6a4399] transition-colors font-medium">{t.cta.button}</a>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
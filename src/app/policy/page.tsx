"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useI18n } from "@/i18n/I18nProvider";

const titleCls = "font-['Bahnschrift-SemiBold',Helvetica] text-white text-3xl md:text-4xl mb-6 text-center";
const paragraph = "text-[#e4e4e4] leading-relaxed text-sm md:text-base";
const wrapper = "bg-[#2c1b48] border border-[#3d2a5a] rounded-2xl p-8 md:p-12 space-y-6";
const subtle = "text-[#b8b4c2]";
const accent = "text-[#c84cd8]";

export default function PolicyPage(): React.JSX.Element {
    const { data: session } = useSession();
    const { messages: t, language } = useI18n();

    const companyName = t.policy.companyName;

    return (
        <main className="bg-[#130c1f] w-full flex justify-center text-white py-16 px-8 md:px-10 lg:px-20">
            <div className="w-full max-w-5xl space-y-16">
                {/* Hero */}
                <header className="text-center space-y-6">
                    <h1 className="font-['Bahnschrift-SemiBold',Helvetica] text-4xl md:text-5xl leading-tight">
                        {t.policy.title}
                    </h1>
                    <p className={`${paragraph} max-w-3xl mx-auto`}>{t.policy.subtitle}</p>
                    <p className="text-xs uppercase tracking-wider text-[#8d819f]">{t.policy.lastUpdated.replace('{date}', new Date().toLocaleDateString(language))}</p>
                </header>

                {/* 1. General */}
                <section className={wrapper} id="general">
                    <h2 className={titleCls}>{t.policy.general.title}</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}><span className={accent}>{companyName}</span>{t.policy.general.p1.replace('{companyName}', '')}</p>
                        <p className={paragraph}>{t.policy.general.p2}</p>
                        <p className={`${paragraph} ${subtle}`}>{t.policy.general.p3}</p>
                    </div>
                </section>

                {/* 2. Data collected */}
                <section className={wrapper} id="data-collected">
                    <h2 className={titleCls}>{t.policy.dataCollected.title}</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">{t.policy.dataCollected.personal.title}</h3>
                            <ul className="space-y-2 text-left inline-block">
                                {t.policy.dataCollected.personal.items.map((item: string, index: number) => (
                                    <li key={index} className={paragraph}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">{t.policy.dataCollected.technical.title}</h3>
                            <ul className="space-y-2 text-left inline-block">
                                {t.policy.dataCollected.technical.items.map((item: string, index: number) => (
                                    <li key={index} className={paragraph}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">{t.policy.dataCollected.behavioral.title}</h3>
                            <ul className="space-y-2 text-left inline-block">
                                {t.policy.dataCollected.behavioral.items.map((item: string, index: number) => (
                                    <li key={index} className={paragraph}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <p className={`${paragraph} text-center pt-4`}>{t.policy.dataCollected.p1}</p>
                </section>

                {/* 3. Usage of data */}
                <section className={wrapper} id="usage">
                    <h2 className={titleCls}>{t.policy.usage.title}</h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-6 text-center">
                            <h3 className="font-semibold text-lg">{t.policy.usage.services.title}</h3>
                            <p className={paragraph}>{t.policy.usage.services.p1}</p>
                            <h3 className="font-semibold text-lg">{t.policy.usage.communication.title}</h3>
                            <p className={paragraph}>{t.policy.usage.communication.p1}</p>
                        </div>
                        <div className="space-y-6 text-center">
                            <h3 className="font-semibold text-lg">{t.policy.usage.analytics.title}</h3>
                            <p className={paragraph}>{t.policy.usage.analytics.p1}</p>
                            <h3 className="font-semibold text-lg">{t.policy.usage.marketing.title}</h3>
                            <p className={paragraph}>{t.policy.usage.marketing.p1}</p>
                        </div>
                    </div>
                    <p className={`${paragraph} text-center pt-4`}>{t.policy.usage.p1}</p>
                </section>

                {/* CTA only if not logged in */}
                {!session && (
                    <section className={`${wrapper} bg-[#342154]`}>
                        <h2 className={titleCls}>{t.policy.cta.title}</h2>
                        <p className={`${paragraph} text-center max-w-xl mx-auto`}>{t.policy.cta.p1}</p>
                        <div className="flex justify-center pt-2">
                            <a href="/signup" className="inline-flex items-center justify-center h-12 px-10 rounded-lg bg-[#7f51b3] hover:bg-[#6a4399] transition-colors font-medium">{t.policy.cta.button}</a>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
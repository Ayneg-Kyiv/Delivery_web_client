"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useI18n } from "@/i18n/I18nProvider";

const titleCls = "font-['Bahnschrift-SemiBold',Helvetica] text-white text-3xl md:text-4xl mb-6 text-center";
const paragraph = "text-[#e4e4e4] leading-relaxed text-sm md:text-base";
const wrapper = "bg-[#2c1b48] border border-[#3d2a5a] rounded-2xl p-8 md:p-12 space-y-6";
const subtle = "text-[#b8b4c2]";
const accent = "text-[#c84cd8]";

export default function TermsPage(): React.JSX.Element {
    const { data: session } = useSession();
    const { messages: t, language } = useI18n();

    const companyName = t.terms.companyName;

    return (
        <main className="bg-[#130c1f] w-full flex justify-center text-white py-16 px-8 md:px-10 lg:px-20">
            <div className="w-full max-w-5xl space-y-16">
                {/* Hero */}
                <header className="text-center space-y-6">
                    <h1 className="font-['Bahnschrift-SemiBold',Helvetica] text-4xl md:text-5xl leading-tight">
                        {t.terms.title}
                    </h1>
                    <p className={`${paragraph} max-w-3xl mx-auto`}>
                        {t.terms.subtitle}
                    </p>
                    <p className="text-xs uppercase tracking-wider text-[#8d819f]">
                        {/* {t.terms.lastUpdated.replace('{date}', new Date().toLocaleDateString(language))} */}
                        {t.terms.lastUpdated.replace('{date}', '')}
                    </p>
                </header>

                {/* 1. General */}
                <section className={wrapper} id="general">
                    <h2 className={titleCls}>{t.terms.general.title}</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}>
                            <span className={accent}>{companyName}</span>{t.terms.general.p1.replace('{companyName}', '')}
                        </p>
                        <p className={paragraph}>
                            {t.terms.general.p2}
                        </p>
                        <p className={`${paragraph} ${subtle}`}>
                            {t.terms.general.p3}
                        </p>
                    </div>
                </section>

                {/* 2. Реєстрація та акаунт */}
                <section className={wrapper} id="account">
                    <h2 className={titleCls}>{t.terms.account.title}</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}>
                            {t.terms.account.p1}
                        </p>
                        <p className={paragraph}>
                            {t.terms.account.p2}
                        </p>
                    </div>
                </section>

                {/* 3. Права та обов’язки користувача */}
                <section className={wrapper} id="user-rights">
                    <h2 className={titleCls}>{t.terms.userRights.title}</h2>
                    <div className="grid md:grid-cols-2 gap-10 text-center">
                        <div className="space-y-6">
                            <h3 className="font-semibold text-lg">{t.terms.userRights.rights.title}</h3>
                            <ul className="space-y-2 text-left inline-block">
                                {t.terms.userRights.rights.items.map((item: string, index: number) => (
                                    <li key={index} className={paragraph}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h3 className="font-semibold text-lg">{t.terms.userRights.obligations.title}</h3>
                            <ul className="space-y-2 text-left inline-block">
                                {t.terms.userRights.obligations.items.map((item: string, index: number) => (
                                    <li key={index} className={paragraph}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 4. Відповідальність */}
                <section className={wrapper} id="liability">
                    <h2 className={titleCls}>{t.terms.liability.title}</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}>
                            {t.terms.liability.p1}
                        </p>
                        <p className={paragraph}>
                            {t.terms.liability.p2}
                        </p>
                    </div>
                </section>

                {/* 5. Інтелектуальна власність */}
                <section className={wrapper} id="ip">
                    <h2 className={titleCls}>{t.terms.ip.title}</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}>
                            {t.terms.ip.p1.replace('{companyName}', companyName)}
                        </p>
                    </div>
                </section>

                {/* 6. Прикінцеві положення */}
                <section className={wrapper} id="final">
                    <h2 className={titleCls}>{t.terms.final.title}</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}>
                            {t.terms.final.p1}
                        </p>
                    </div>
                </section>

                {/* CTA only if not logged in */}
                {!session && (
                    <section className={`${wrapper} bg-[#342154]`}>
                        <h2 className={titleCls}>{t.terms.cta.title}</h2>
                        <p className={`${paragraph} text-center max-w-xl mx-auto`}>
                            {t.terms.cta.p1}
                        </p>
                        <div className="flex justify-center pt-2">
                            <a href="/signup" className="inline-flex items-center justify-center h-12 px-10 rounded-lg bg-[#7f51b3] hover:bg-[#6a4399] transition-colors font-medium">{t.terms.cta.button}</a>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
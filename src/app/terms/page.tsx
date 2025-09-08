"use client";

import React from "react";
import { useSession } from "next-auth/react";

const titleCls = "font-['Bahnschrift-SemiBold',Helvetica] text-white text-3xl md:text-4xl mb-6 text-center";
const paragraph = "text-[#e4e4e4] leading-relaxed text-sm md:text-base";
const wrapper = "bg-[#2c1b48] border border-[#3d2a5a] rounded-2xl p-8 md:p-12 space-y-6";
const subtle = "text-[#b8b4c2]";
const accent = "text-[#c84cd8]";

// TODO: замініть назву компанії на фактичну юридичну (ФОП / ТОВ)
const COMPANY_NAME = "Стартап \"Cargix Platform\"";

export default function TermsPage(): React.JSX.Element {
    const { data: session } = useSession();

    return (
        <main className="bg-[#130c1f] w-full flex justify-center text-white py-16 px-4 md:px-10">
            <div className="w-full max-w-5xl space-y-16">
                {/* Hero */}
                <header className="text-center space-y-6">
                    <h1 className="font-['Bahnschrift-SemiBold',Helvetica] text-4xl md:text-5xl leading-tight">
                        Умови використання
                    </h1>
                    <p className={`${paragraph} max-w-3xl mx-auto`}>
                        Цей документ регулює правила користування онлайн‑платформою, права та обов’язки користувачів і адміністрації, а також умови надання послуг. Ознайомтесь уважно перед початком роботи з сервісом.
                    </p>
                    <p className="text-xs uppercase tracking-wider text-[#8d819f]">
                        Останнє оновлення: {new Date().toLocaleDateString("uk-UA")}
                    </p>
                </header>

                {/* 1. General */}
                <section className={wrapper} id="general">
                    <h2 className={titleCls}>1. Загальні положення</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}>
                            <span className={accent}>{COMPANY_NAME}</span> (далі – «Сервіс», «ми») надає платформу для публікації та прийому заявок на доставку, взаємодії між відправниками та перевізниками / водіями.
                        </p>
                        <p className={paragraph}>
                            Використовуючи Сервіс, ви погоджуєтесь з цими Умовами. Якщо ви не згодні – припиніть використання платформи.
                        </p>
                        <p className={`${paragraph} ${subtle}`}>
                            Адміністрація залишає за собою право змінювати Умови в будь-який час. Оновлення публікуються на цій сторінці.
                        </p>
                    </div>
                </section>

                {/* 2. Реєстрація та акаунт */}
                <section className={wrapper} id="account">
                    <h2 className={titleCls}>2. Реєстрація та акаунт</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}>
                            Для повного доступу до функціоналу необхідна реєстрація. Ви зобов’язані надати достовірні дані та не передавати доступ третім особам.
                        </p>
                        <p className={paragraph}>
                            Адміністрація може призупинити або видалити акаунт у разі порушення Умов або спроби шахрайства.
                        </p>
                    </div>
                </section>

                {/* 3. Права та обов’язки користувача */}
                <section className={wrapper} id="user-rights">
                    <h2 className={titleCls}>3. Права та обов’язки користувача</h2>
                    <div className="grid md:grid-cols-2 gap-10 text-center">
                        <div className="space-y-6">
                            <h3 className="font-semibold text-lg">3.1 Права</h3>
                            <ul className="space-y-2 text-left inline-block">
                                <li className={paragraph}>Користуватись сервісом згідно з призначенням</li>
                                <li className={paragraph}>Отримувати підтримку та консультації</li>
                                <li className={paragraph}>Видаляти акаунт та персональні дані</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h3 className="font-semibold text-lg">3.2 Обов’язки</h3>
                            <ul className="space-y-2 text-left inline-block">
                                <li className={paragraph}>Не порушувати чинне законодавство України</li>
                                <li className={paragraph}>Не розміщувати неправдиву або шкідливу інформацію</li>
                                <li className={paragraph}>Дотримуватись правил етики та взаємоповаги</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 4. Відповідальність */}
                <section className={wrapper} id="liability">
                    <h2 className={titleCls}>4. Відповідальність</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}>
                            Сервіс не несе відповідальності за дії користувачів, які порушують закон або ці Умови. Всі угоди між відправниками та перевізниками укладаються напряму, без участі адміністрації.
                        </p>
                        <p className={paragraph}>
                            Ми докладаємо зусиль для забезпечення безпеки та стабільності роботи платформи, але не гарантуємо відсутність технічних збоїв.
                        </p>
                    </div>
                </section>

                {/* 5. Інтелектуальна власність */}
                <section className={wrapper} id="ip">
                    <h2 className={titleCls}>5. Інтелектуальна власність</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}>
                            Всі права на контент, дизайн, програмний код та торгові марки належать <span className={accent}>{COMPANY_NAME}</span> або відповідним правовласникам. Заборонено копіювати, поширювати чи змінювати матеріали без дозволу.
                        </p>
                    </div>
                </section>

                {/* 6. Прикінцеві положення */}
                <section className={wrapper} id="final">
                    <h2 className={titleCls}>6. Прикінцеві положення</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}>
                            Усі спірні питання вирішуються шляхом переговорів або відповідно до законодавства України. Для зв’язку з адміністрацією використовуйте форму підтримки або email, вказаний на сайті.
                        </p>
                    </div>
                </section>

                {/* CTA only if not logged in */}
                {!session && (
                    <section className={`${wrapper} bg-[#342154]`}>
                        <h2 className={titleCls}>Створіть акаунт</h2>
                        <p className={`${paragraph} text-center max-w-xl mx-auto`}>
                            Щоб публікувати відправлення та швидше знаходити перевізників – зареєструйтесь. Це займає менше 1 хвилини.
                        </p>
                        <div className="flex justify-center pt-2">
                            <a href="/signup" className="inline-flex items-center justify-center h-12 px-10 rounded-lg bg-[#7f51b3] hover:bg-[#6a4399] transition-colors font-medium">Почати</a>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
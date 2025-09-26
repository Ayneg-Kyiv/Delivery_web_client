"use client";

import React from "react";
import { useSession } from "next-auth/react";

const titleCls = "font-['Bahnschrift-SemiBold',Helvetica] text-white text-3xl md:text-4xl mb-6 text-center";
const paragraph = "text-[#e4e4e4] leading-relaxed text-sm md:text-base";
const wrapper = "bg-[#2c1b48] border border-[#3d2a5a] rounded-2xl p-8 md:p-12 space-y-6";
const subtle = "text-[#b8b4c2]";
const accent = "text-[#c84cd8]";

// TODO: замініть назву компанії на фактичну юридичну (ФОП / ТОВ)
const COMPANY_NAME = "ТОВ \"Delivery Platform\"";

export default function PolicyPage(): React.JSX.Element {
    const { data: session } = useSession();

    return (
        <main className="bg-[#130c1f] w-full flex justify-center text-white py-16 px-8 md:px-10 lg:px-20">
            <div className="w-full max-w-5xl space-y-16">
                {/* Hero */}
                <header className="text-center space-y-6">
                    <h1 className="font-['Bahnschrift-SemiBold',Helvetica] text-4xl md:text-5xl leading-tight">
                        Політика конфіденційності
                    </h1>
                    <p className={`${paragraph} max-w-3xl mx-auto`}>Цей документ пояснює, які дані ми збираємо, з якою метою їх обробляємо та які права має користувач. Мета – прозорість, безпека та відповідність чинному законодавству України та принципам захисту персональних даних (GDPR — якщо застосовується).</p>
                    <p className="text-xs uppercase tracking-wider text-[#8d819f]">Останнє оновлення: {new Date().toLocaleDateString("uk-UA")}</p>
                </header>

                {/* 1. General */}
                <section className={wrapper} id="general">
                    <h2 className={titleCls}>1. Загальні положення</h2>
                    <div className="space-y-5 text-center">
                        <p className={paragraph}><span className={accent}>{COMPANY_NAME}</span> (далі – «Сервіс», «ми») є власником та адміністратором онлайн‑платформи для публікації та прийому заявок на доставку, взаємодії між відправниками та перевізниками / водіями.</p>
                        <p className={paragraph}>Мета цієї Політики – поінформувати користувачів про принципи збору, зберігання, використання та захисту персональних даних, а також про права користувачів і механізми їх реалізації.</p>
                        <p className={`${paragraph} ${subtle}`}>Використовуючи Сервіс, ви підтверджуєте ознайомлення з цією Політикою. Якщо ви не згодні – припиніть використання платформи.</p>
                    </div>
                </section>

                {/* 2. Data collected */}
                <section className={wrapper} id="data-collected">
                    <h2 className={titleCls}>2. Які дані збираються</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">2.1. Особисті</h3>
                            <ul className="space-y-2 text-left inline-block">
                                <li className={paragraph}>Ім’я / прізвище / нікнейм</li>
                                <li className={paragraph}>Email</li>
                                <li className={paragraph}>Телефон</li>
                                <li className={paragraph}>Адреси / напрямки відправки та отримання</li>
                                <li className={paragraph}>Дані профілю (аватар, мова)</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">2.2. Технічні</h3>
                            <ul className="space-y-2 text-left inline-block">
                                <li className={paragraph}>IP‑адреса</li>
                                <li className={paragraph}>Файли cookies</li>
                                <li className={paragraph}>Тип браузера, ОС, модель пристрою</li>
                                <li className={paragraph}>Геолокація (за згодою)</li>
                                <li className={paragraph}>Журнали подій (log, помилки)</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">2.3. Поведінкові</h3>
                            <ul className="space-y-2 text-left inline-block">
                                <li className={paragraph}>Відвідані сторінки</li>
                                <li className={paragraph}>Пошукові / фільтраційні запити</li>
                                <li className={paragraph}>Кліки та взаємодії з UI</li>
                                <li className={paragraph}>Час сесії та частота входів</li>
                                <li className={paragraph}>Статистика конверсій (анонімізовано)</li>
                            </ul>
                        </div>
                    </div>
                    <p className={`${paragraph} text-center pt-4`}>Джерела: дані, які ви вводите; автоматично зібрані технічні журнали; аналітичні інструменти. Ми НЕ збираємо платіжні реквізити без прямої необхідності та не зберігаємо їх у відкритому вигляді.</p>
                </section>

                {/* 3. Usage of data */}
                <section className={wrapper} id="usage">
                    <h2 className={titleCls}>3. Як використовуються дані</h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-6 text-center">
                            <h3 className="font-semibold text-lg">3.1 Надання послуг</h3>
                            <p className={paragraph}>Реєстрація акаунта, авторизація, відновлення доступу, створення та обробка заявок на доставку, відображення рейтингу та історії взаємодій.</p>
                            <h3 className="font-semibold text-lg">3.2 Комунікація</h3>
                            <p className={paragraph}>Email / push / SMS сповіщення щодо статусів відправлень, технічні повідомлення, відповіді служби підтримки.</p>
                        </div>
                        <div className="space-y-6 text-center">
                            <h3 className="font-semibold text-lg">3.3 Аналітика та покращення</h3>
                            <p className={paragraph}>Моніторинг продуктивності, виявлення помилок, оптимізація UX, балансування навантаження.</p>
                            <h3 className="font-semibold text-lg">3.4 Маркетинг</h3>
                            <p className={paragraph}>Персоналізація інтерфейсу та пропозицій, ремаркетинг (за згодою), оцінка ефективності рекламних кампаній.</p>
                        </div>
                    </div>
                    <p className={`${paragraph} text-center pt-4`}>Обробка здійснюється на підставі: (а) вашої згоди; (б) необхідності для виконання договору (оферти); (в) законних інтересів Сервісу – підтримка безпеки та розвитку функціоналу.</p>
                </section>

                {/* CTA only if not logged in */}
                {!session && (
                    <section className={`${wrapper} bg-[#342154]`}>
                        <h2 className={titleCls}>Створіть акаунт</h2>
                        <p className={`${paragraph} text-center max-w-xl mx-auto`}>Щоб публікувати відправлення та швидше знаходити перевізників – зареєструйтесь. Це займає менше 1 хвилини.</p>
                        <div className="flex justify-center pt-2">
                            <a href="/signup" className="inline-flex items-center justify-center h-12 px-10 rounded-lg bg-[#7f51b3] hover:bg-[#6a4399] transition-colors font-medium">Почати</a>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
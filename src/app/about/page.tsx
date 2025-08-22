'use client';

import React from 'react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import CardContent from '@/components/ui/card-content';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { label: 'Активних користувачів', value: '12 800+' },
    { label: 'Сумісних поїздок / місяць', value: '3 400+' },
    { label: 'Зекономлено CO₂ (оцінка)', value: '~18 т' },
    { label: 'Середній рейтинг довіри', value: '4.87/5' },
  ];

  const pillars = [
    {
      title: 'Людяність',
      text: 'Живий діалог між відправником і водієм, взаємоповага та прозорі очікування замість анонімної логістики.'
    },
    {
      title: 'Ефективність',
      text: 'Використовуємо вже заплановані поїздки: кожне вільне місце в багажнику — шанс не їхати порожнім.'
    },
    {
      title: 'Довіра',
      text: 'Профілі, історія доставок, відгуки, багаторівнева верифікація та система внутрішніх сигналів ризику.'
    },
    {
      title: 'Екологічність',
      text: 'Зменшуємо «порожні кілометри» та стимулюємо комбінування дрібних відправлень для меншого вуглецевого сліду.'
    },
  ];

  const safety = [
    { head: 'Верифікація', body: 'Перевірка email, телефону, документа та добровільне підтвердження авто.' },
    { head: 'Рейтинг & відгуки', body: 'Алгоритмічне зважування останніх оцінок і сигналів довіри.' },
    { head: 'Чат з фільтрами', body: 'Автоматичне приховування підозрілих посилань та фішингових шаблонів.' },
    { head: 'Страхування (roadmap)', body: 'Модель часткового покриття і опціональних доплат — готуємо до запуску.' },
  ];

  const timeline = [
    { year: '2024 Q3', title: 'Ідея', text: 'Формування гіпотези про спільне використання маршрутів замість класичної кур’єрської моделі.' },
    { year: '2024 Q4', title: 'Перший прототип', text: 'Мінімальний маршрутний матчинг + ручна модерація водіїв.' },
    { year: '2025 Q1', title: 'Алгоритм оптимізації', text: 'Покращений підбір: вага, габарити, обхідні сегменти, коефіцієнти довіри.' },
    { year: '2025 Q2', title: 'Розширення географії', text: 'Додані міжобласні напрямки та адаптивні зони передачі.' },
    { year: '2025 Q3', title: 'Фокус на якості', text: 'Аналітика інцидентів, скорочення часу відповіді підтримки до < 2 хв.' },
  ];

  return (
    <main className="relative overflow-hidden">
      {/* HERO */}
      <section className="w-full pt-28 pb-24 px-8 md:px-20 xl:px-40 bg-gradient-to-b from-[#18121f] to-[#0f0c13] relative">
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: "radial-gradient(circle at 15% 25%, #3d2a5a 0, transparent 60%), radial-gradient(circle at 85% 70%, #3d2a5a 0, transparent 55%)" }} />
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="[font-family:'Bahnschrift-Regular',Helvetica] text-6xl md:text-7xl leading-[1.05] mb-10">Про Cargix</h1>
          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12">
            Ми перетворюємо поїздки, що вже відбуваються, на можливість надіслати речі швидше, дешевше та з меншим впливом на довкілля.
            Платформа об’єднує людей і робить доставку більш людяною та розумною.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {stats.map(s => (
              <div key={s.label} className="min-w-[200px] bg-[#2a2332] border border-[#3d2a5a] rounded-2xl px-6 py-5 text-left">
                <div className="text-3xl [font-family:'Bahnschrift-Regular',Helvetica] mb-1">{s.value}</div>
                <div className="text-sm fg-secondary">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="w-full px-8 md:px-20 xl:px-40 py-24 relative">
        <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #3d2a5a 0, transparent 60%), radial-gradient(circle at 80% 70%, #3d2a5a 0, transparent 55%)" }} />
        <div className="relative max-w-7xl mx-auto">
          <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl md:text-6xl mb-14">Наші опорні принципи</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {pillars.map(p => (
              <div key={p.title} className="bg-[#2a2332] border border-[#3d2a5a] rounded-2xl p-6 flex flex-col">
                <h3 className="text-2xl mb-3 [font-family:'Bahnschrift-Regular',Helvetica]">{p.title}</h3>
                <p className="fg-secondary text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="w-full px-8 md:px-20 xl:px-40 py-24 bg-[#141018] relative overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, #3d2a5a 0, transparent 55%), radial-gradient(circle at 90% 80%, #3d2a5a 0, transparent 55%)" }} />
        <div className="relative max-w-6xl mx-auto">
          <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl md:text-6xl mb-10">Як ми працюємо</h2>
          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-lg md:text-xl leading-relaxed max-w-4xl mb-12">
            Алгоритм корелює маршрут, доступний об’єм, вагу, рейтинг водія та часові вікна. Відсіюємо екстремальні ціни,
            формуємо справедливий діапазон і пропонуємо оптимізацію: точка передачі, об’єднання відправлень, гнучка дата.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-[#2a2332] border border-[#3d2a5a] rounded-2xl p-6">
              <h3 className="text-xl mb-3 [font-family:'Bahnschrift-Regular',Helvetica]">1. Ввід & контекст</h3>
              <p className="text-sm fg-secondary leading-relaxed">Місто → місто, вага, габарити, дата, умови передачі.</p>
            </div>
            <div className="bg-[#2a2332] border border-[#3d2a5a] rounded-2xl p-6">
              <h3 className="text-xl mb-3 [font-family:'Bahnschrift-Regular',Helvetica]">2. Підбір & фільтрація</h3>
              <p className="text-sm fg-secondary leading-relaxed">Матчимо попутні поїздки, виключаємо низьку репутацію, аномальні тарифи.</p>
            </div>
            <div className="bg-[#2a2332] border border-[#3d2a5a] rounded-2xl p-6">
              <h3 className="text-xl mb-3 [font-family:'Bahnschrift-Regular',Helvetica]">3. Прозора оцінка</h3>
              <p className="text-sm fg-secondary leading-relaxed">Показуємо діапазон вартості + підказки як ще зекономити.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section className="w-full px-8 md:px-20 xl:px-40 py-24 relative">
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start gap-14">
            <div className="md:w-1/2">
              <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl md:text-6xl mb-8">Безпека & довіра</h2>
              <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-lg leading-relaxed mb-6">
                Ми впроваджуємо поетапні рівні верифікації та аналіз патернів поведінки. Система ризиків реагує до скарг,
                знижуючи видимість підозрілих профілів. Дані мінімізовані — лише те, що потрібно для безпечного матчингу.
              </p>
              <Link href="/policy">
                <Button className="h-[54px] w-[200px] button-type-1 rounded-xl" onClick={()=>{}} text="Політика" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 flex-1">
              {safety.map(item => (
                <div key={item.head} className="bg-[#2a2332] border border-[#3d2a5a] rounded-2xl p-5">
                  <h3 className="text-lg mb-2 [font-family:'Bahnschrift-Regular',Helvetica]">{item.head}</h3>
                  <p className="text-xs fg-secondary leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

     

    </main>
  );
}

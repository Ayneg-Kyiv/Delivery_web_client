'use client';

import React from 'react';
import Button from '@/components/ui/button';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

export default function AboutPage() {
  const { messages: t } = useI18n();

  const stats = t.about.stats;
  const pillars = t.about.pillars;
  const developers = t.about.developers;
  const safety = t.about.safetyItems;
  const howWeWorkSteps = t.about.howWeWorkSteps;

  return (
    <main className="relative overflow-hidden">
      {/* HERO */}
      <section className="w-full pt-14 md:pt-14 pb-12 md:pb-24 px-8 md:px-20 xl:px-40 bg-gradient-to-b from-[#18121f] to-[#0f0c13] relative">
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: "radial-gradient(circle at 15% 25%, #3d2a5a 0, transparent 60%), radial-gradient(circle at 85% 70%, #3d2a5a 0, transparent 55%)" }} />
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="[font-family:'Bahnschrift-Regular',Helvetica] text-6xl md:text-7xl leading-[1.05] mb-10">{t.about.title}</h1>
          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12">
            {t.about.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {stats.map((s: { label: string, value: string }) => (
              <div key={s.label} className="min-w-[200px] bg-[#2a2332] border border-[#3d2a5a] rounded-2xl px-6 py-5 text-left">
                <div className="text-3xl [font-family:'Bahnschrift-Regular',Helvetica] mb-1">{s.value}</div>
                <div className="text-sm fg-secondary">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="w-full px-8 md:px-20 xl:px-40 py-12 md:py-24 relative">
        <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #3d2a5a 0, transparent 60%), radial-gradient(circle at 80% 70%, #3d2a5a 0, transparent 55%)" }} />
        <div className="relative max-w-7xl mx-auto">
          <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl md:text-6xl mb-14">{t.about.pillarsTitle}</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {pillars.map((p: { title: string, text: string }) => (
              <div key={p.title} className="bg-[#2a2332] border border-[#3d2a5a] rounded-2xl p-6 flex flex-col">
                <h3 className="text-2xl mb-3 [font-family:'Bahnschrift-Regular',Helvetica]">{p.title}</h3>
                <p className="fg-secondary text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="w-full px-8 md:px-20 xl:px-40 py-12 md:py-24 bg-[#141018] relative overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, #3d2a5a 0, transparent 55%), radial-gradient(circle at 90% 80%, #3d2a5a 0, transparent 55%)" }} />
        <div className="relative max-w-6xl mx-auto">
          <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl md:text-6xl mb-10">{t.about.howWeWorkTitle}</h2>
          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-lg md:text-xl leading-relaxed max-w-4xl mb-12">
            {t.about.howWeWorkSubtitle}
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {howWeWorkSteps.map((step: { title: string, text: string }) => (
                <div key={step.title} className="bg-[#2a2332] border border-[#3d2a5a] rounded-2xl p-6">
                    <h3 className="text-xl mb-3 [font-family:'Bahnschrift-Regular',Helvetica]">{step.title}</h3>
                    <p className="text-sm fg-secondary leading-relaxed">{step.text}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section className="w-full px-8 md:px-20 xl:px-40 py-12 md:py-24 relative">
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start gap-14">
            <div className="md:w-1/2">
              <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl md:text-6xl mb-8">{t.about.safetyTitle}</h2>
              <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-lg leading-relaxed mb-6">
                {t.about.safetySubtitle}
              </p>
              <Link href="/policy">
                <Button className="h-[54px] w-[200px] button-type-1 rounded-xl" onClick={()=>{}} text={t.about.policyButton} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 flex-1">
              {safety.map((item: { head: string, body: string }) => (
                <div key={item.head} className="bg-[#2a2332] border border-[#3d2a5a] rounded-2xl p-5">
                  <h3 className="text-lg mb-2 [font-family:'Bahnschrift-Regular',Helvetica]">{item.head}</h3>
                  <p className="text-xs fg-secondary leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className='w-full px-8 md:px-20 xl:px-40 py-12 md:py-24 bg-gradient-to-b from-[#18121f] to-[#0f0c13] relative'>
        <div className="relative max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-start gap-14">
              <div className="md:w-1/2">
                <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl md:text-6xl mb-8">{t.about.developersTitle}</h2>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-lg leading-relaxed mb-6">
                {t.about.developersSubtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-6 flex-1">
                  <>
                    {developers.map((dev: { title: string, text: string }) => (
                        <div
                            key={dev.title}
                            className="bg-[#2a2332] border border-[#3d2a5a] rounded-2xl p-5 flex-1 min-w-[220px] max-w-[calc(50%-12px)]"
                            style={{ flexBasis: 'calc(50% - 12px)' }}
                        >
                            <h3 className="text-lg mb-2 [font-family:'Bahnschrift-Regular',Helvetica]">{dev.title}</h3>
                            <p className="text-xs fg-secondary leading-relaxed">{dev.text}</p>
                        </div>
                    ))}
                  </>
              </div>
            </div>
        </div>
      </section>

    </main>
  );
}